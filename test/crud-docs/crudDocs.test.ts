import assert from "node:assert";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crudDocs from "../../app/src/use-cases/crud-docs/crudDocs";
import { setOpenAiClientForTests } from "../../app/src/use-cases/crud-docs/openai";
import { Project } from "../../app/src/entities/index";

// creates temp directory where test works from
function makeTempDir():string{
    return fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-crud-docs-"))
}

// makes temp project where test work from
function makeProject(configPath:string, docPath:string, contextFiles:Array<string>):Project{
    return new Project({
        projName: "test-project",
        existingConfigFile: true,
        configPath,
        docFolderPath: path.dirname(docPath),
        docFilesContext: [
            {
                docsFilePath: docPath,
                allowedContext: contextFiles
            }
        ],
        llmLinked: true
    })
}

test("passes when docs are updated with OpenAI output", async (t) => {
    const tempDir = makeTempDir()
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

    const calls:Array<any> = []
    const docPath = path.join(tempDir, "docs.md")
    const contextPath = path.join(tempDir, "context.ts")
    const unusedContextPath = path.join(tempDir, "unused.ts")

    fs.writeFileSync(docPath, "# Existing docs")
    fs.writeFileSync(contextPath, "export const usedContext = true")
    fs.writeFileSync(unusedContextPath, "export const unusedContext = true")

    // creating cutom test client
    setOpenAiClientForTests({
        responses: {
            create: async (request:any) => {
                calls.push(request)
                return {
                    output_text: JSON.stringify({
                        updatedDocs: "# Updated docs",
                        ambiguities: ""
                    })
                }
            }
        }
    } as any) // check this type for 'any'
    // reassign the created client as undefined
    t.after(() => setOpenAiClientForTests(undefined))

    // gets proejct in var
    const project = makeProject(
        path.join(tempDir, "dutoaocs.config.json"),
        docPath,
        [contextPath, unusedContextPath]
    )

    const result = await crudDocs(project, docPath, [contextPath])

    assert.strictEqual(result, true)
    assert.strictEqual(fs.readFileSync(docPath, "utf-8"), "# Updated docs")
    assert.strictEqual(calls.length, 1)
    assert.match(calls[0].input, /# Existing docs/)
    assert.match(calls[0].input, /usedContext/)
    assert.doesNotMatch(calls[0].input, /unusedContext/)
})

test("passes when unconfigured docs do not call OpenAI", async (t) => {
    const tempDir = makeTempDir()
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

    const calls:Array<any> = []
    const docPath = path.join(tempDir, "docs.md")
    fs.writeFileSync(docPath, "# Existing docs")

    setOpenAiClientForTests({
        responses: {
            create: async (request:any) => {
                calls.push(request)
                return {
                    output_text: JSON.stringify({
                        updatedDocs: "# Should not write",
                        ambiguities: ""
                    })
                }
            }
        }
    } as any)
    t.after(() => setOpenAiClientForTests(undefined))

    const project = new Project({
        projName: "test-project",
        existingConfigFile: true,
        configPath: path.join(tempDir, "dutoaocs.config.json"),
        docFolderPath: tempDir,
        docFilesContext: [],
        llmLinked: true
    })

    const result = await crudDocs(project, docPath, [])

    assert.strictEqual(result, false)
    assert.strictEqual(calls.length, 0)
    assert.strictEqual(fs.readFileSync(docPath, "utf-8"), "# Existing docs")
})

test("passes when missing docs do not call OpenAI", async (t) => {
    const tempDir = makeTempDir()
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

    const calls:Array<any> = []
    const docPath = path.join(tempDir, "missing-docs.md")

    setOpenAiClientForTests({
        responses: {
            create: async (request:any) => {
                calls.push(request)
                return {
                    output_text: JSON.stringify({
                        updatedDocs: "# Should not write",
                        ambiguities: ""
                    })
                }
            }
        }
    } as any)
    t.after(() => setOpenAiClientForTests(undefined))

    const project = makeProject(
        path.join(tempDir, "dutoaocs.config.json"),
        docPath,
        []
    )

    const result = await crudDocs(project, docPath, [])

    assert.strictEqual(result, false)
    assert.strictEqual(calls.length, 0)
    assert.strictEqual(fs.existsSync(docPath), false)
})
