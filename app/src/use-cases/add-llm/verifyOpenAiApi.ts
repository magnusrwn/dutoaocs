import OpenAI from "openai";
import { getClient } from "../crud-docs/openai";


export default async function verifyOpenAiApi(): Promise<boolean> {
  const client = getClient()
  try{
    await client.responses.create({
      model: "gpt-5.4-mini",
      input: "Testing",
      max_output_tokens: 16
    })
    return true
  } catch(error) {
    console.error("\nOpenAI API verification failed.")

    if (error instanceof OpenAI.AuthenticationError) {
      console.error("The API key was rejected. Check that OPENAI_API_KEY in .env is correct and active.")
    } else if (error instanceof OpenAI.PermissionDeniedError) {
      console.error("The API key is not permitted to use this API or model. Check the key's project and model permissions.")
    } else if (error instanceof OpenAI.RateLimitError) {
      console.error("OpenAI rate limited the request or the project has no available quota.")
      console.error(`API message: ${error.message}`)
    } else if (error instanceof OpenAI.APIConnectionError) {
      console.error("Could not connect to the OpenAI API. Check your network connection and try again.")
      console.error(`Details: ${error.message}`)
    } else if (error instanceof OpenAI.APIError) {
      console.error(`OpenAI returned HTTP ${error.status ?? "unknown"}: ${error.message}`)
      if (error.requestID) console.error(`Request ID: ${error.requestID}`)
    } else {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`Unexpected error: ${message}`)
    }

    return false
  }
}
