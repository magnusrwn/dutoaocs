import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import {getProjectName, getProjectConfigPath, getProjectDocsPath} from "../use-cases/init"
import { Project } from "../entities/index";
import { JsonProjectStore } from "../infrastructure/index";

const rl:readline.Interface = readline.createInterface({ input, output });

export default async function init(userLocation:string){
    // get basics
    const newProjectName = await getProjectName(rl)
    const newProjectConfigPath = await getProjectConfigPath(userLocation, rl)
    const newProjectDocsPath = await getProjectDocsPath(userLocation, rl)

    // setup project/ config using json store
    const newProject:Project = new Project({
        projName:newProjectName,
        existingConfigFile:false,
        configPath:newProjectConfigPath,
        docFolderPath:newProjectDocsPath,
        docFilesContext:undefined,
        llmLinked:false,
    })

    const jsonProjStore = new JsonProjectStore(newProjectConfigPath)
    jsonProjStore.write(newProject)
    
    newProject.existingConfigFile = true
    jsonProjStore.write(newProject)

    // alert to adding llm
    console.log("Add your LLM model to begin creating/ updating documentation")
    console.log("Run the command: 'dutoaocs add-llm'")
    console.log("To See all commands run 'dutoaocs --help'")
}