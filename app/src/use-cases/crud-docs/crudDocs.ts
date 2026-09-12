import fs from "node:fs"
import { contextToDocs, ContextBinItem, DocsResponse } from "./openai";
import { Project, DocFileContext } from "../../entities/index";

export async function updateOne(project:Project, doc:string, contextFiles:Array<string>):Promise<boolean>{
    const targetDoc:string = doc
    const targetDocContext = project.docFilesContext?.find(
        (docContext) => docContext.docsFilePath === targetDoc
    )

    if (targetDocContext === undefined){
        console.log(`doc file "${targetDoc}" is not setup as a doc file in your project`)
        console.log("to add one, use 'dutoaocs add-doc-file file-name-here'")
        return false
    }

    if (!fs.existsSync(targetDoc)){
        console.log(`docs file "${targetDoc}" does not exist`)
        console.log("pass in a valid docs file path")
        return false
    }

    const currentDocs:string = fs.readFileSync(targetDoc, 'utf-8')
    let contextBin:Array<ContextBinItem> = []
    const resolvedContextFiles:Array<string> = targetDocContext.allowedContext.filter(
        (allowedContext) => contextFiles.includes(allowedContext)
    )

    for (let i = 0; i < resolvedContextFiles.length; i++){
        let fileName:string = resolvedContextFiles[i]
        if (!fs.existsSync(fileName)){
            console.log(`context file "${fileName}" does not exist`)
            console.log("skipping missing context file")
            continue
        }

        let readContext:string = fs.readFileSync(fileName,'utf-8')
        let item: ContextBinItem = {"fileName":fileName, "fileRead":readContext}
        contextBin.push(item)
    }

    const docsResponse:DocsResponse = await contextToDocs(currentDocs, contextBin)
    fs.writeFileSync(targetDoc, docsResponse.updatedDocs)

    if (docsResponse.ambiguities.trim().length > 0){
        console.log("unresolved documentation questions:")
        console.log(docsResponse.ambiguities)
    }
    return true
}

export async function updateAll(project:Project):Promise<boolean>{
    if (project.docFilesContext === undefined || project.docFilesContext.length === 0){
        console.log("no doc files added to your 'dutoaocs.config.json'")
        console.log("use 'dutoaocs add-doc-file file-name-here' to add doc files")
        return false
    }

    let allUpdated = true
    for (let i = 0; i < project.docFilesContext.length; i++){
        const itemToUpdate: DocFileContext = project.docFilesContext[i]
        const updated = await updateOne(project, itemToUpdate.docsFilePath, itemToUpdate.allowedContext)
        if (!updated){
            allUpdated = false
        }
    }
    return allUpdated
}

export function clearAll(userLocation:string):boolean{
    // store deleted items... can be empty
    // print
    // return.
    return true
}
