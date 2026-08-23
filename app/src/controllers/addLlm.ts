import readline from "node:readline/promises"
import { config, stdin as input, stdout as output } from "node:process"
import { Project } from "../entities/index";
import { JsonProjectStore } from "../infrastructure/index";
import { getProjectIfExists, showApiLinksteps } from "../use-cases/add-llm/index";
import fs from "node:fs"

const rl = readline.createInterface({input, output});

export default async function addLlm(command:Array<string>, userLocation: string):Promise<boolean>{
    // get project, set API linked to true
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (project){
        const projPath:string = project.configPath
        const jsonProjStore:JsonProjectStore = new JsonProjectStore(projPath)
        project.llmLinked = true
        jsonProjStore.write(project)
    } else {
        console.log("No 'dutoaocs.config.json' was found. Make sure you are at the project root and/ or run 'dutoaocs init' to create one")
        return false
    }

    // show the API link steps
    showApiLinksteps()
    
    const goodToGo = (await rl.question("Have you completed the above steps?(yes/no) "))
    

    // Verify
    if (await verifyOpenAiApi){ // NOTE import/ export issues as is '.mjs'
        console.log("OpenAI API addedd successfuly. It's time to create context. Run 'dutoaocs --show-context' to see all commands related to adding cotext.")
        return true
    } else {
        // MAKE ROLLBACK
        console.log("Linking failed. Rolledback your API key link. Please try again")
        return false
    }
}
