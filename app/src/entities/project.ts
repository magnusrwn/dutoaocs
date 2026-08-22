import Entity from "./entity";

// builder types
export type LlmProfile = {
    llmProvider: "openai" | "anthropic" | undefined
    linkedOn:string
    llmApiToken:string
}

// parent type
type ProjectAttrs = {
    projectId: string
    projName: string
    existingConfigFile:boolean
    configPath:string
    existingDocFolder:boolean
    docContext:Array<string>
    llmLinked:boolean
    llmProfile:LlmProfile  
}

// export class
export class Project extends Entity<ProjectAttrs>{
    projectId!: string
    projName!: string
    existingConfigFile!:boolean
    configPath!:string
    existingDocFolder?:boolean
    docContext?:Array<string>
    llmLinked!:boolean
    llmProfile?:LlmProfile   
}