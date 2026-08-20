import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import {getProjectName, getProjectConfigPath, getProjectDocsPath} from "../use-cases/init"


const rl:readline.Interface = readline.createInterface({ input, output });

export default async function init(userLocation:string){
    // get basics
    const projectName = await getProjectName(rl)
    const projectConfigPath = await getProjectConfigPath(userLocation, rl)
    const projectDocsPath = await getProjectDocsPath(userLocation, rl)

    // setup project/ config using json store

}