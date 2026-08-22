import { Project, LlmProfile} from "../entities/index"

export interface ProjectStore {
    exists():boolean;
    read():Project;
    write(project:Project):void;
    updateConfig(newProject:Project, pathTo:string):void;
}
