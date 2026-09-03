import { Project } from "../../entities";
import { JsonProjectStore } from "../../infrastructure";
import fs from "node:fs";

export default function addContextToProject(docFile:string, context:string, project:Project):boolean{
    if (!fs.existsSync(docFile)){
        console.log(`docs file "${docFile}" does not exist`)
        console.log("pass in a valid docs file path")
        return false
    }

    if (!fs.existsSync(context)){
        console.log(`context file "${context}" does not exist`)
        console.log("pass in a valid context file path")
        return false
    }

    const jsonStore:JsonProjectStore = new JsonProjectStore(project.configPath)
    project.docFilesContext ??= []

    const existingDocContext = project.docFilesContext.find(
        (docContext) => docContext.docsFilePath === docFile
    )

    if (existingDocContext !== undefined){
        if (!existingDocContext.allowedContext.includes(context)){
            existingDocContext.allowedContext.push(context)
        }
    } else{
        project.docFilesContext.push({
            docsFilePath: docFile,
            allowedContext: [context]
        })
    }

    jsonStore.write(project)
    return true
}
