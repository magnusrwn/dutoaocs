import { Project } from "../entities/index"
import { getProjectIfExists } from "../use-cases/add-llm"
import addContextToProject from "../use-cases/add-context/addContextToProject"
import "dotenv/config"
import fs from "node:fs"

export default function addContext(command:Array<string>, userLocation:string){
    // check that command[1] exists, and command[2] does not (for the filename)
    // check this check is ok
    if (command.length > 2 && command.length < 5){
        console.log(`ipnut the context address after 'add-context' command. Unsure on what ${command[3]} is`)
    }

    // get project form location
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (project === undefined) {
        console.log("project not found in working dir")
        console.log("make sure you are on the same level as your config file")
    } else {
        // add the file (check for first)
        if (fs.existsSync(command[1]) && fs.existsSync(command[2]) && command[1].includes('docs')){
            if(addContextToProject(command[1], command[2], project)){
                console.log(`added ${command[2]} as context to for ${command[1]}`)
            } else{
                console.log(`failed to add ${command[2]} as context  for ${command[1]}`)
            }
        } else {
            console.log(`context of ${command[1]} or docs file ${command[2]} does not exist`)
            console.log("pass in context file location relative to your working dir")
        }
    }
}
