import { getProjectIfExists } from "../use-cases/add-llm/index"
import { Project } from "../entities"
import { addDocFileToProject, removeDocFileFromProj } from "../use-cases/crud-doc-file/index"

export function addDocFile(command:Array<string>, userLocation:string){
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (project === undefined){
        console.log("project not found in current working dir")
        console.log(`make sure your config file exists in ${userLocation}`)
    } else if (command[1]){
        addDocFileToProject(command[1], project)
    } else {
        console.log("bad command")
        console.log("make sure that when running 'add-doc-file' you follow the pattern:")
        console.log("'dutoaocs add-doc-file path-to-doc-file-from-root'")
    }
}

export function removeDocFile(command:Array<string>, userLocation:string){
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (project === undefined){
        console.log("project not found in current working dir")
        console.log(`make sure your config file exists in ${userLocation}`)
    } else if (command[1]){
        // `command` is `process.argv.slice(2)`, so index 1 is the first argument after `rem-doc-file`.
        const docFileAdress:string = command[1]
        removeDocFileFromProj(docFileAdress, project)
    } else {
        console.log("bad command")
        console.log("make sure that when running 'rem-doc-file' you follow the pattern:")
        console.log("'dutoaocs rem-doc-file path-to-doc-file-from-root'")       
    }
}
