import OpenAI from "openai";
import rollbackDotenv from "./rollbackDotenv";


export default async function verifyOpenAiApi(): Promise<boolean> {
  const client = new OpenAI();
  try{
    await client.responses.create({
      model: "gpt-5.4-mini",
      input: "Testing",
      max_output_tokens: 16
    })
    return true
  } catch(error) {
    console.log("API Key did not pass auth. Rollingback.")
    if (error instanceof OpenAI.AuthenticationError){
      console.log("Ensure you have sut it up abd copied it to .env correctly")
      console.log("In .env it should be under the name 'OPENAI_API_KEY'")
      rollbackDotenv()
    }

    if (error instanceof OpenAI.APIConnectionError){
      console.log("OpenAi API is down right now. Rolling back.")
      console.log("Please try again later by running 'dutoaocs add-llm --verify'")
      rollbackDotenv()
    }
    return false
  }
}
