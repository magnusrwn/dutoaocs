import OpenAI from "openai";

type OpenAiClient = Pick<OpenAI, "responses">

let client:OpenAiClient | undefined

function getClient():OpenAiClient{
    if (client === undefined){
        client = new OpenAI()
    }

    return client
}

export function setOpenAiClientForTests(testClient:OpenAiClient | undefined):void{
    client = testClient
}

export type ContextBinItem = {
    fileName: string
    fileRead: string
}

export type DocsResponse = {
    updatedDocs: string
    ambiguities: string
}

export async function contextToDocs(currentDocs:string, context:Array<ContextBinItem>):Promise<DocsResponse>{
    const response = await getClient().responses.create({
        model: "gpt-5.6-luna",
        input: `
            You are maintaining documentation for a small to mid-sized personal project.
            Update the existing documentation using the supplied context.

            Requirements:
            - Write concise, useful documentation. Prefer short sections and bullet points.
            - Explain what the referenced files do, especially when no existing documentation is provided.
            - Do not suggest or describe modifications to the source files themselves.
            - Treat this document as one part of a larger docs set; avoid repeating unrelated project-wide material.
            - Preserve the style and purpose of any existing documentation when updating or appending.
            - Reuse existing links in the same style, and point new links at the most relevant supplied file paths.
            - Include unresolved questions that would make the documentation more accurate.
            - Return valid JSON only, with no markdown fences or surrounding commentary.

            JSON shape:
            {
                "updatedDocs": "markdown string",
                "ambiguities": "markdown string"
            }

            Current state of files:
            ${JSON.stringify(context, null, 2)}

            Current documentation, if it exists:
            ${currentDocs}
        `,
        text: {
            format: {
                type: "json_object",
            },
        },
    })

    return JSON.parse(response.output_text) as DocsResponse
}
