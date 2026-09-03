import { getProjectIfExists } from "../use-cases/add-llm/index"
import { Project } from "../entities"
import { addDocFileToProject, removeDocFileFromProj } from "../use-cases/crud-doc-file/index"

export function addDocFile(command:Array<string>, userLocation:string){
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (project === undefined){
        console.log("project not found in current working dir")
        console.log(`make sure your config file exists in ${userLocation}`)
    } else if (command[1]){
        // should be command[1]... review
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
    } else if (command[1]){ // again, check if it should be command 1 (come up in tests tmr morning) (thus this comment is very temp)
        const docFileAdress:string = command[1] // or 2
        removeDocFileFromProj(docFileAdress, project)
    } else {
        console.log("bad command")
        console.log("make sure that when running 'rem-doc-file' you follow the pattern:")
        console.log("'dutoaocs rem-doc-file path-to-doc-file-from-root'")       
    }
}