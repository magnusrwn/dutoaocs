import fs from "node:fs"
import rollbackDotenv from "./rollbackDotenv"

export default function verifyGitignore(currentpath:string):boolean{
    if (!fs.existsSync(currentpath+".gitignore")){
        console.log("Can not find .gitignore")
        console.log("Make sure '.gitignore' is in your project root")
        console.log("Make sure you are located in your project root ")
        return false
    }

    // read gitignore to ensure '.env' is in it
    const gitignore_data:string = fs.readFileSync(currentpath+".gitignore", "utf-8")
    if (!gitignore_data.includes(".env")){
        console.log("'.env' not found inside your .gitignore")
        console.log("It is necessary for it to be in there to continue")
        console.log("Rolling back your change in your .env.")
        rollbackDotenv()
        console.log("Re-add your OpenAi API key again, and re-run 'dutoaocs add-llm --verify'")
        return false
    }
    return true
}