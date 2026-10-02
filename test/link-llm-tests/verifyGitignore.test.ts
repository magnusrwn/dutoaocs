import verifyGitignore, { VerifyGitignoreResponse } from "../../app/src/use-cases/add-llm/verifyGitignore"
import test from "node:test"
import assert from "node:assert"

test('passes when ".gitignore" is found and includes ".env" in it', () => {
    const path:string = '' // this projet has a gitignore
    const response:VerifyGitignoreResponse = verifyGitignore(path)
    
    // can equal '.gitignore' as thats current dir, and good. Else it needs to be '/.gitignore'
    assert.strictEqual(response.path?.includes("/.gitignore") || response.path === ".gitignore", true)
    assert.strictEqual(response.ok, true)
})

test('passes when ".gitignore" is not found from the bad path handed in', () => {
    const path:string = 'bad-path/'
    const resp:boolean = verifyGitignore(path).ok
    assert.strictEqual(resp, false)
})