import { Project } from "../../entities";
import { JsonProjectStore } from "../../infrastructure";

export default function removeContextFromProj(contextAddress:string, project:Project){
    project.docFilesContext ??= []
    
    const jsonStore:JsonProjectStore = new JsonProjectStore(project.configPath)

    if (project.docFilesContext === undefined){
        console.log(`cannot remove ${contextAddress}`)
        console.log("no context exists in project")
    } else {
        const outerIndex:number = project.docFilesContext.findIndex(item => item.allowedContext.includes(contextAddress))
        if (outerIndex >= 0){
            const innerIndex:number = project.docFilesContext[outerIndex].allowedContext.findIndex(context => context === contextAddress)
            if (innerIndex >= 0){
                // delete from array and re-write
                project.docFilesContext[outerIndex].allowedContext.splice(innerIndex, 1)
                jsonStore.write(project)
                return
            }
        }
        // else blocl for all above 'if' statements
        console.log(`nothing in project context matches ${contextAddress}`)
        console.log("ensure it is correct")
    }
}