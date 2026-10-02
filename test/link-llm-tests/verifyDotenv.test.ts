import verifyDotenv from "../../app/src/use-cases/add-llm/verifyDotenv"
import test from "node:test"
import assert from "node:assert"
import "dotenv/config"

test('passes when "OPENAI_API_KEY" is present in .env', ()=>{
    // The vlaue of 'OPENAI_API_KEY' in my .env
    assert.strictEqual(verifyDotenv(), true)
})
