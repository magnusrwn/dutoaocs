import Entity from "./entity";

// builder types
type LlmProfile = {
    llmProvider: "openai" | "anthropic"
    linkedOn:string
    llmApiToken:string
}
type DocArchitectureAllowedContext = {
    allowedContextFiles?:Array<string>
}
type DocArchitectiure = {
    docfileName:DocArchitectureAllowedContext
}

// parent type
type ProjectAttrs = {
    projectId: string
    projName: string
    existingConfigFile:boolean
    configPath?:string
    docArchitectire?:DocArchitectiure
    llmLinked:boolean
    llmProfile?:LlmProfile
}

// export class
export default class Project extends Entity<ProjectAttrs>{
    projectId!: string
    projName!: string
    existingConfigFile!:boolean
    configPath?:string
    docArchitectire?:DocArchitectiure
    llmLinked!:boolean
    llmProfile?:LlmProfile   
}