import Entity from "./entity";

type ProjectAttrs = {
    projectId: string
    projName: string
    configPath:string
    existingConfigFile:boolean
}

export default class Project extends Entity<ProjectAttrs>{
    projectId!: string
    projName!: string
    configPath?:string
    existingConfigFile!:boolean
}