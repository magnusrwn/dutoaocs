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
        projectId:"1", // create an id maker function
        projName:newProjectName,
        existingConfigFile:true,
        configPath:newProjectConfigPath,
        existingDocFolder:true,
        docContext:[],
        llmLinked:false,
        llmProfile:undefined
    })

    // write the new made obj to the paths using JsonProjStore
    const JsonProjStore = new JsonProjectStore(newProject.configPath)

    // write the new proj to the given location
    JsonProjStore.write(newProject)

    // alert to adding llm
    console.log("Add your LLM model to egin creating/ updating documentation")
    console.log("Run: 'dutoaocs add-llm'")
}