import verifyGitignore, { VerifyGitignoreResponse } from "../../app/src/use-cases/add-llm/verifyGitignore"
import test from "node:test"
import assert from "node:assert"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"

test('passes when ".gitignore" is found and includes ".env" in it', (t) => {
    const projectPath:string = fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-gitignore-"))
    const gitignorePath:string = path.join(projectPath, ".gitignore")
    fs.writeFileSync(gitignorePath, ".env\n", "utf-8")
    t.after(() => fs.rmSync(projectPath, {recursive:true, force:true}))

    const response:VerifyGitignoreResponse = verifyGitignore(projectPath)
    
    assert.strictEqual(response.path, gitignorePath)
    assert.strictEqual(response.ok, true)
})

test('passes when ".gitignore" is not found from the bad path handed in', (t) => {
    const projectPath:string = fs.mkdtempSync(path.join(os.tmpdir(), "dutoaocs-no-gitignore-"))
    t.after(() => fs.rmSync(projectPath, {recursive:true, force:true}))

    const resp:boolean = verifyGitignore(projectPath).ok
    assert.strictEqual(resp, false)
})
