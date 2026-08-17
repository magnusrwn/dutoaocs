import { Project } from "../entities"

export interface ProjectStore {
    exists():boolean;
    read():Project;
    write(project:Project): void;   
}
