import { Project } from "../entities";
import fs from "node:fs";

export default class JsonProjectStore {
    constructor(private readonly filePath:string) {}
    exists(){
        return fs.existsSync(this.filePath)
    }
    read(){
        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        return new Project(data)
    }
    write(project:Project):void{ 
        return fs.writeFileSync(this.filePath, JSON.stringify(project))
    }
};