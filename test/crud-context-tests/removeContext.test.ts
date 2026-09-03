import assert from "node:assert";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import removeContextFromProject from "../../app/src/use-cases/crud-context/removeContextFromProj"
import getProjectIfExists from "../../app/src/use-cases/add-llm/getProjectIfExists";
import { Project } from "../../app/src/entities/index";

const fixturePath:string = "./test/test-proj-root"
const baseProject:Project | undefined = getProjectIfExists(fixturePath)

function makeTempProject(project: Project): Project {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-remove-context-"))
    const tempConfigPath = path.join(tempDir, "dutoaocs.config.json")
    const projectCopy = new Project({
        ...project,
        configPath: tempConfigPath,
        docFilesContext: [
            {
                docsFilePath: "test/test-proj-root/docs/msc.md",
                allowedContext: ["test/test-proj-root/context/example-context.md"]
            },
            {
                docsFilePath: "test/test-proj-root/docs/other.md",
                allowedContext: ["test/test-proj-root/context/example-context.md"]
            }
        ]
    })

    fs.writeFileSync(tempConfigPath, JSON.stringify(projectCopy))
    return projectCopy
}

function cleanupTempProject(project: Project): void {
    fs.rmSync(path.dirname(project.configPath), { recursive: true, force: true })
}

if (baseProject === undefined){
    console.log(`project not found at path ${fixturePath}`)
    console.log("make path is good")
} else {
    test('passes when error occurs and func returns false from bad doc input', (t) =>{
        const project = makeTempProject(baseProject)
        t.after(() => cleanupTempProject(project))
        const docFile = "test/test-proj-root/docs/missing.md"
        const context = "test/test-proj-root/context/example-context.md"

        assert.strictEqual(removeContextFromProject(docFile, context, project), false)
    })

    test('passes when func returns true from good input and only removes from matching doc file', (t) =>{
        const project = makeTempProject(baseProject)
        t.after(() => cleanupTempProject(project))
        const docFile = "test/test-proj-root/docs/msc.md"
        const otherDocFile = "test/test-proj-root/docs/other.md"
        const context = "test/test-proj-root/context/example-context.md"

        assert.strictEqual(removeContextFromProject(docFile, context, project), true)

        const updated = getProjectIfExists(project.configPath)
        assert.ok(updated)

        const docContext = updated.docFilesContext?.find(
            (item) => item.docsFilePath === docFile
        )
        const otherDocContext = updated.docFilesContext?.find(
            (item) => item.docsFilePath === otherDocFile
        )

        assert.ok(docContext)
        assert.ok(otherDocContext)
        assert.ok(!docContext.allowedContext.includes(context))
        assert.ok(otherDocContext.allowedContext.includes(context))
    })
}
