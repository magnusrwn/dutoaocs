import { Project, DocArchitecture, LlmProfile} from "../entities/index"

export interface ProjectStore {
    exists():boolean;
    read():Project;
    updateConfig<K extends keyof Project>(fieldName:K, newData:Project[K]):boolean;
    // Unique update as need to set 'Project.llmLinked' = true
    updateConfigLlmLinked(newLlmProfile:LlmProfile):boolean;
}
