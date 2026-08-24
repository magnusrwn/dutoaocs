export default function verifyDotenv():boolean{
    if(process.env.OPENAI_API_KEY){
        return true
    } else {
        console.log("Dotenv not found to have 'OPENAI_API_KEY'")
        console.log("Ensure you are running from your project root (where your '.env' should be)")
        console.log("Run 'dutoaocs add-llm' to see linking process")
        return false
    }
}