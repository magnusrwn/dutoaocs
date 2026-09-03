import fs from "node:fs"
import { Project } from "../../entities"
import { JsonProjectStore } from "../../infrastructure"

export default function addDocFileToProject(docFilePath: string, project: Project):boolean{
    if (fs.existsSync(docFilePath)) {
        project.docFilesContext ??= []

        const jsonStore: JsonProjectStore = new JsonProjectStore(project.configPath)

        const existingDocContext = project.docFilesContext.find(
            (docContext) => docContext.docsFilePath === docFilePath
        )

        if (existingDocContext === undefined) {
            project.docFilesContext.push({
                docsFilePath: docFilePath,
                allowedContext: []
            })
        }

        jsonStore.write(project)
        return true

    } else {
        console.log("bad command")
        console.log(`"${docFilePath}" does not exist relative to your position`)
        console.log("please hand in a valid path")
        return false
    }
}
