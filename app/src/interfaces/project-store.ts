import { Project, LlmProfile} from "../entities/index"

export interface ProjectStore {
    exists():boolean;
    read():Project;
    write(project:Project):void;
    updateConfig<K extends keyof Project>(fieldName:K, newData:Project[K]):boolean;
    updateConfigLlmLinked(newLlmProfile:LlmProfile):boolean;
}
