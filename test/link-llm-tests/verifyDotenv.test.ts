import verifyDotenv from "../../app/src/use-cases/add-llm/verifyDotenv"
import test from "node:test"
import assert from "node:assert"

test('passes when "OPENAI_API_KEY" is present in the environment', ()=>{
    assert.strictEqual(verifyDotenv({OPENAI_API_KEY:"test-key"}), true)
})

test('fails when "OPENAI_API_KEY" is not present in the environment', ()=>{
    assert.strictEqual(verifyDotenv({}), false)
})
