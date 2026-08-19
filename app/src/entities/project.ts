import Entity from "./entity";

// builder types
export type LlmProfile = {
    llmProvider: "openai" | "anthropic"
    linkedOn:string
    llmApiToken:string
}
type DocArchitectureAllowedContext = {
    allowedContextFiles?:Array<string>
}
export type DocArchitecture = {
    docfileName: DocArchitectureAllowedContext
}

// parent type
type ProjectAttrs = {
    projectId: string
    projName: string
    existingConfigFile:boolean
    configPath?:string
    docArchitectire?:DocArchitecture
    llmLinked:boolean
    llmProfile?:LlmProfile
}

// export class
export class Project extends Entity<ProjectAttrs>{
    projectId!: string
    projName!: string
    existingConfigFile!:boolean
    configPath?:string
    docArchitecture?:DocArchitecture
    llmLinked!:boolean
    llmProfile?:LlmProfile   
}