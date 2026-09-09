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
            fileRead: "path/to/file/to/read.ts"
        }
    ])

    const request = calls[0]

    assert.strictEqual(request.model, "gpt-5.6-luna")
    assert.strictEqual(request.text.format.type, "json_object")
    assert.match(request.input, /# Existing docs/)
    assert.match(request.input, /app\/src\/example\.ts/)
    assert.match(request.input, /path\/to\/file\/to\/read\.ts/)
    assert.match(request.input, /"updatedDocs"/)
    assert.match(request.input, /"ambiguities"/)
})

test("passes when OpenAI returns valid for n amound of times ('update-all' case testing)", async (t) => {
    
    // define the things to be called
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
    t.after(() => {setOpenAiClientForTests(undefined)})

    await contextToDocs(
        "# Existing docs", [
            {
                fileName: "app/src/example.ts1",
                fileRead: "path/to/file/to/read.ts1"
            },
            {
                fileName: "app/src/example.ts2",
                fileRead: "path/to/file/to/read.ts2"
            },
            {
                fileName: "app/src/example.ts3",
                fileRead: "path/to/file/to/read.ts3"
            }
        ]
    )

    for (let i = 0; i < calls.length; i++){
        let request = calls[i]
        assert.strictEqual(request.model, "gpt-5.6-luna")
        assert.strictEqual(request.text.format.type, "json_object")
        assert.match(request.input, /# Existing docs/)
        assert.match(request.input, /"updatedDocs"/)
        assert.match(request.input, /"ambiguities"/)
        // match for each
        assert.match(request.input, /app\/src\/example\.ts1/)
        assert.match(request.input, /path\/to\/file\/to\/read\.ts1/)
        assert.match(request.input, /app\/src\/example\.ts2/)
        assert.match(request.input, /path\/to\/file\/to\/read\.ts2/)
        assert.match(request.input, /app\/src\/example\.ts3/)
        assert.match(request.input, /path\/to\/file\/to\/read\.ts3/)
    }
})
