import assert from "node:assert";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import addContextToProject from "../../app/src/use-cases/crud-context/addContextToProject"
import getProjectIfExists from "../../app/src/use-cases/add-llm/getProjectIfExists";
import { Project } from "../../app/src/entities/index"

const fixturePath:string = "./test/test-proj-root"
const baseProject:Project | undefined = getProjectIfExists(fixturePath)

function makeTempProject(project: Project): Project {
    // makes a temp dir in the session (check) to run the tests to. Does not persist
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-add-context-"))
    const tempConfigPath = path.join(tempDir, "dutoaocs.config.json")
    const projectCopy = new Project({
        ...project,
        configPath: tempConfigPath,
        docFilesContext: project.docFilesContext?.map((item) => ({
            docsFilePath: item.docsFilePath,
            allowedContext: [...item.allowedContext]
        })) ?? []
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
    test('passes when error occurs and func returns false from bad input', (t) =>{
        const project = makeTempProject(baseProject)
        t.after(() => cleanupTempProject(project))
        const docFile = "test/test-proj-root/docs/msc.md"
        const context = "test/test-proj-root/context/missing-context.md"

        assert.strictEqual(addContextToProject(docFile, context, project), false)
    })

    test('passes when func returns true from good input', (t) =>{
        const project = makeTempProject(baseProject)
        t.after(() => cleanupTempProject(project))
        const docFile = "test/test-proj-root/docs/msc.md"
        const context = "test/test-proj-root/context/example-context.md"

        assert.strictEqual(addContextToProject(docFile, context, project), true)

        const updated = getProjectIfExists(project.configPath)
        assert.ok(updated)

        const docContext = updated.docFilesContext?.find(
            (item) => item.docsFilePath === docFile
        )

        assert.ok(docContext)
        assert.ok(docContext.allowedContext.includes(context))
    })
}
