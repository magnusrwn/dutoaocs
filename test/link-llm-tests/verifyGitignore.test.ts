import verifyGitignore from "../../app/src/use-cases/add-llm/verifyGitignore"
import test from "node:test"
import assert from "node:assert"

test('passes when ".gitignore" is found and includes ".env" in it', () => {
    const path:string = '' // this projet has a gitignore
    assert.strictEqual(verifyGitignore(path), true)
})

test('passes when ".gitignore" is not found from the bad path handed in', () => {
    const path:string = 'bad-path/'
    assert.strictEqual(verifyGitignore(path), false)
})