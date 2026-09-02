import fs from "node:fs"
import { getProjectIfExists } from "../use-cases/add-llm/index"
import { Project } from "../entities"
import addDocFileToProject from "../use-cases/addDocFile/addDocFileToProject"

export default function addDocFile(command:Array<string>, userLocation:string){
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
        console.log("'add-doc-file relative-path-to-doc-file'")
    }



}