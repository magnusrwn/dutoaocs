import { Project } from "../../entities";
import { JsonProjectStore } from "../../infrastructure";

export default function removeContextFromProj(docFile:string, contextName:string, project:Project):boolean{
    project.docFilesContext ??= []

    const jsonStore:JsonProjectStore = new JsonProjectStore(project.configPath)

    const docContext = project.docFilesContext.find(
        (item) => item.docsFilePath === docFile
    )

    if (docContext === undefined){
        console.log(`doc file ${docFile} has no context entry in project`)
        console.log("ensure the docs file path is correct")
        return false
    }

    const contextIndex:number = docContext.allowedContext.findIndex(
        (context) => context === contextName
    )

    if (contextIndex >= 0){
        docContext.allowedContext.splice(contextIndex, 1)
        jsonStore.write(project)
        return true
    } else {
        console.log(`nothing in project context matches ${contextName}`)
        console.log("ensure it is correct")
        return false
    }
}
