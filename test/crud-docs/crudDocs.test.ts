import assert from "node:assert";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crudDocs, { crudAllDocs } from "../../app/src/use-cases/crud-docs/crudDocs";
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


// for 'update-all'
test("passes when all docs are updated with OpenAI output", async (t) => {
    const tempDir = makeTempDir()
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

    const calls:Array<any> = []
    const firstDocPath = path.join(tempDir, "first-docs.md")
    const secondDocPath = path.join(tempDir, "second-docs.md")
    const firstContextPath = path.join(tempDir, "first-context.ts")
    const secondContextPath = path.join(tempDir, "second-context.ts")

    fs.writeFileSync(firstDocPath, "# First docs")
    fs.writeFileSync(secondDocPath, "# Second docs")
    fs.writeFileSync(firstContextPath, "export const firstContext = true")
    fs.writeFileSync(secondContextPath, "export const secondContext = true")

    setOpenAiClientForTests({
        responses: {
            create: async (request:any) => {
                calls.push(request)
                return {
                    output_text: JSON.stringify({
                        updatedDocs: `# Updated docs ${calls.length}`,
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
        docFilesContext: [
            {
                docsFilePath: firstDocPath,
                allowedContext: [firstContextPath]
            },
            {
                docsFilePath: secondDocPath,
                allowedContext: [secondContextPath]
            }
        ],
        llmLinked: true
    })

    const result = await crudAllDocs(project)

    assert.strictEqual(result, true)
    assert.strictEqual(fs.readFileSync(firstDocPath, "utf-8"), "# Updated docs 1")
    assert.strictEqual(fs.readFileSync(secondDocPath, "utf-8"), "# Updated docs 2")
    assert.strictEqual(calls.length, 2)
    assert.match(calls[0].input, /# First docs/)
    assert.match(calls[0].input, /firstContext/)
    assert.doesNotMatch(calls[0].input, /secondContext/)
    assert.match(calls[1].input, /# Second docs/)
    assert.match(calls[1].input, /secondContext/)
    assert.doesNotMatch(calls[1].input, /firstContext/)
})

test("passes when update-all reports false if one doc is missing", async (t) => {
    const tempDir = makeTempDir()
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }))

    const calls:Array<any> = []
    const existingDocPath = path.join(tempDir, "existing-docs.md")
    const missingDocPath = path.join(tempDir, "missing-docs.md")

    fs.writeFileSync(existingDocPath, "# Existing docs")

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
    } as any)
    t.after(() => setOpenAiClientForTests(undefined))

    const project = new Project({
        projName: "test-project",
        existingConfigFile: true,
        configPath: path.join(tempDir, "dutoaocs.config.json"),
        docFolderPath: tempDir,
        docFilesContext: [
            {
                docsFilePath: existingDocPath,
                allowedContext: []
            },
            {
                docsFilePath: missingDocPath,
                allowedContext: []
            }
        ],
        llmLinked: true
    })

    const result = await crudAllDocs(project)

    assert.strictEqual(result, false)
    assert.strictEqual(calls.length, 1)
    assert.strictEqual(fs.readFileSync(existingDocPath, "utf-8"), "# Updated docs")
    assert.strictEqual(fs.existsSync(missingDocPath), false)
})
