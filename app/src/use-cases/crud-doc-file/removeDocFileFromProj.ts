import { Project } from "../../entities"
import { JsonProjectStore } from "../../infrastructure"


export default function removeDocFileFromProj(docFilePath:string, project:Project):boolean{
    project.docFilesContext ??= []
    const jsonStore: JsonProjectStore = new JsonProjectStore(project.configPath)

    if (project.docFilesContext === undefined){
        console.log("no context exists in project config")
        return false
    } else {
        
        const indexOfStaged:number = project.docFilesContext.findIndex((itter)=>{
            return itter.docsFilePath === docFilePath
        })

        if (indexOfStaged < 0){
            console.log(`the handed doc file path of ${docFilePath} is not setup as a doc file in your project`)
            console.log("to set it up run 'dutoaocs add-doc-file /path-to-doc-file-here'")
            return false
        } else {
            project.docFilesContext.splice(indexOfStaged, 1)
            jsonStore.write(project)
            return true
        }
    }

}
