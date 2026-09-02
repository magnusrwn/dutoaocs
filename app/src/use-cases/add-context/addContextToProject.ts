import { Project } from "../../entities";
import { JsonProjectStore } from "../../infrastructure";

export default function addContextToProject(docFile:string, context:string, project:Project):boolean{
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
