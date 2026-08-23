import Entity from "./entity";

// builder types
export type LlmProfile = {
    linkedOn:string
    apiKeyInEnv:boolean
}
export type DocFileContext = {
    filePath:string
    allowedContext: Array<string> | undefined
}
// parent type
export type ProjectAttrs = {
    projName: string
    existingConfigFile:boolean
    configPath:string
    docFolderPath:string,
    docFilesContext:Array<DocFileContext>
    llmLinked:boolean
    llmProfile:LlmProfile  
}

// export class
export class Project extends Entity<ProjectAttrs>{
    projName!: string
    existingConfigFile!:boolean
    configPath!:string
    docFolderPath!:string
    docFilesContext?:Array<DocFileContext>
    llmLinked!:boolean
    llmProfile?:LlmProfile   
}