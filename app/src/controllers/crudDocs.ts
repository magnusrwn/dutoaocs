import { Project, DocFileContext } from "../entities";
import { getProjectIfExists } from "../use-cases/add-llm";
import { crudDocs } from "../use-cases/crud-docs/index";

export async function updateDocs(command:Array<string>, userLocation:string):Promise<boolean>{
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (project === undefined){
        console.log(`project not found at path ${userLocation}`)
        console.log("please ensure your 'dutoaocs.config.json' is in your working dir")
        return false
    } else if (project.docFilesContext === undefined){
        console.log("no doc files added to your 'dutoaocs.config.json'")
        console.log("use 'dutoaocs add-doc-file file-name-here' to add doc files")
        return false
    } else if (!command[1]){
        console.log("bad command")
        console.log("make sure your command follows the pattern: 'dutoaocs update-doc doc-file-path-here'")
        return false
    } else {
        const matcher = command[1].trim()
        const itemToUpdate: DocFileContext | undefined = project.docFilesContext.find(itter => itter.docsFilePath === matcher)
        if (itemToUpdate === undefined){
            console.log(`no doc file named "${matcher}" is in your project as a doc file`)
            console.log("to add one use 'dutoaocs add-doc-file file-name-here'")
            return false
        } else {
            return await crudDocs(project, itemToUpdate.docsFilePath, itemToUpdate.allowedContext)
        }
    }
}
