import "dotenv/config"
import verifyOpenAiApi from "../../app/src/use-cases/add-llm/verifyOpenAiApi"
import assert from "node:assert"
import test from "node:test"
import { contextToDocs, setOpenAiClientForTests } from "../../app/src/use-cases/crud-docs/openai"

test('passes when the openAI key found in the .env is able to make a test request to the OpenAI API', async (t)=>{
    let calls:Array<any> = []
    setOpenAiClientForTests({
        responses:{
            create: async (request:any) =>{
                calls.push(request)
            }
        }
    } as any )
    t.after(() => setOpenAiClientForTests(undefined))
    
    assert.strictEqual(await verifyOpenAiApi(), true)  
})