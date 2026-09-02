import "dotenv/config"
import verifyOpenAiApi from "../../app/src/use-cases/add-llm/verifyOpenAiApi"
import assert from "node:assert"
import test from "node:test"

test('passes when the openAI key found in the .env is able to make a test request to the OpenAI API', async ()=>{
    assert.strictEqual(await verifyOpenAiApi(), true)
})
