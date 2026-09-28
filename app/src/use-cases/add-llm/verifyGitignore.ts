import fs from "node:fs"
import rollbackDotenv from "./rollbackDotenv"
import path from "node:path"

export interface VerifyGitignoreResponse {
    ok:boolean
    path?:string
}

export default function verifyGitignore(currentpath:string):VerifyGitignoreResponse{
    const git_path:string = path.join(currentpath, ".gitignore")
    if (!fs.existsSync(git_path)){
        console.log("Can not find .gitignore")
        console.log("Make sure '.gitignore' is in your project root")
        console.log("Make sure you are located in your project root ")
        return {"ok":false}
    }

    // read gitignore to ensure '.env' is in it
    const gitignore_data:string = fs.readFileSync(git_path, "utf-8")
    if (!gitignore_data.includes(".env")){
        console.log("'.env' not found inside your .gitignore")
        console.log("It is necessary for it to be in there to continue")
        console.log("Rolling back your change in your .env.")
        rollbackDotenv()
        console.log("Re-add your OpenAi API key again, and re-run 'dutoaocs add-llm --verify'")
        return {"ok":false}
    }
    return {"ok":true, "path":git_path}
}