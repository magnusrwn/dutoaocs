import { Project } from "../entities/index";
import { verifyDotenv, getProjectIfExists, verifyGitignore, verifyOpenAiApi } from "../use-cases/add-llm/index";
import { JsonProjectStore } from "../infrastructure/index";

export default async function addLlmVerify(currentpath:string){
    // get project
    const project:Project | undefined = getProjectIfExists(currentpath)
    if(!project){
        console.log("Can not find 'dutoaocs.config.json'")
        console.log("Make sure you are located in you project root, where 'dutoaocs.config.json' must be")
        return
    }

    // verify .gitignore
    if(!verifyGitignore(currentpath)){return}

    // verify .env
    if(!verifyDotenv()){return}

    // Make sample API request
    if (!await verifyOpenAiApi()){return}

    // update project/config
    const jsonProjectStore:JsonProjectStore = new JsonProjectStore(project.configPath)
    project.llmLinked = true
    jsonProjectStore.write(project)

}