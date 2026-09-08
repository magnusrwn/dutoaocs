import assert from "node:assert";
import test from "node:test";
import { contextToDocs, setOpenAiClientForTests } from "../../app/src/use-cases/crud-docs/openai";

test("passes when OpenAI returns docs JSON and it is parsed", async (t) => {
    const calls:Array<any> = []
    const expected = {
        updatedDocs: "# Updated docs",
        ambiguities: ""
    }

    setOpenAiClientForTests({
        responses: {
            create: async (request:any) => {
                calls.push(request)
                return {
                    output_text: JSON.stringify(expected)
                }
            }
        }
    } as any)
    t.after(() => setOpenAiClientForTests(undefined))

    const result = await contextToDocs("# Existing docs", [
        {
            fileName: "app/src/example.ts",
            fileRead: "export const example = true"
        }
    ])

    assert.deepStrictEqual(result, expected)
    assert.strictEqual(calls.length, 1)
})

test("passes when OpenAI request includes docs, context, and JSON output format", async (t) => {
    const calls:Array<any> = []

    setOpenAiClientForTests({
        responses: {
            create: async (request:any) => {
                calls.push(request)
                return {
                    output_text: JSON.stringify({
                        updatedDocs: "# Updated docs",
                        ambiguities: ""
                    })
                }
            }
        }
    } as any)
    t.after(() => setOpenAiClientForTests(undefined))

    await contextToDocs("# Existing docs", [
        {
            fileName: "app/src/example.ts",
            fileRead: "export const example = true"
        }
    ])

    const request = calls[0]

    assert.strictEqual(request.model, "gpt-5.6-luna")
    assert.strictEqual(request.text.format.type, "json_object")
    assert.match(request.input, /# Existing docs/)
    assert.match(request.input, /app\/src\/example\.ts/)
    assert.match(request.input, /export const example = true/)
    assert.match(request.input, /"updatedDocs"/)
    assert.match(request.input, /"ambiguities"/)
})
