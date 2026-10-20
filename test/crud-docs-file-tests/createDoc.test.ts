import assert from "node:assert";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import createDocFile from "../../app/src/use-cases/crud-doc-file/createDocFile";
import { Project } from "../../app/src/entities";

function makeTempDir(): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-create-doc-file-"));
}

function makeProject(docFolderPath: string): Project {
    return new Project({
        projName: "test-project",
        existingConfigFile: true,
        configPath: path.join(docFolderPath, "dutoaocs.config.json"),
        docFolderPath,
        docFilesContext: [],
        llmLinked: false
    });
}

test("creates an empty Markdown file for a valid document name", (t) => {
    const tempDir = makeTempDir();
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
    const project = makeProject(tempDir);

    createDocFile("new-doc_test", project);

    const docPath = path.join(tempDir, "new-doc_test.md");
    assert.equal(fs.existsSync(docPath), true);
    assert.equal(fs.readFileSync(docPath, "utf-8"), "");
});

test("does not create a file for a name containing invalid characters", (t) => {
    const tempDir = makeTempDir();
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
    const project = makeProject(tempDir);

    createDocFile("bad.name", project);

    assert.deepEqual(fs.readdirSync(tempDir), []);
});

test("does not overwrite an existing document", (t) => {
    const tempDir = makeTempDir();
    t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
    const project = makeProject(tempDir);
    const docPath = path.join(tempDir, "existing-doc.md");
    fs.writeFileSync(docPath, "Keep this content", "utf-8");

    createDocFile("existing-doc", project);

    assert.equal(fs.readFileSync(docPath, "utf-8"), "Keep this content");
});
