export interface DotenvVariables {
    OPENAI_API_KEY?:string
}

export default function verifyDotenv(env:DotenvVariables = process.env):boolean{
    if(env.OPENAI_API_KEY){
        return true
    } else {
        console.log("Dotenv not found to have 'OPENAI_API_KEY'")
        console.log("Ensure you are running from your project root (where your '.env' should be)")
        console.log("Run 'dutoaocs add-llm' to see linking process")
        return false
    }
}
