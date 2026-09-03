import Entity from "./entity";

// builder types
export type DocFileContext = {
    docsFilePath: string
    allowedContext: string[]
}
// parent type
export type ProjectAttrs = {
    projName: string
    existingConfigFile:boolean
    configPath:string
    docFolderPath:string,
    docFilesContext:Array<DocFileContext>
    llmLinked:boolean
}

// export class
export class Project extends Entity<ProjectAttrs>{
    projName!: string
    existingConfigFile!:boolean
    configPath!:string
    docFolderPath!:string
    docFilesContext?:Array<DocFileContext>
    llmLinked!:boolean
}