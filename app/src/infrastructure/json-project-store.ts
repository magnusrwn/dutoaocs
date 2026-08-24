import { Project, LlmProfile } from "../entities/index";
import fs from "node:fs";

export default class JsonProjectStore {
    constructor(private readonly filePath:string) {}
    exists():boolean{
        return fs.existsSync(this.filePath)
    }
    
    read():Project{
        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        return new Project(data)
    }
    
    write(project:Project):void{ 
        return fs.writeFileSync(this.filePath, JSON.stringify(project))
    }
    
};
