import { Project } from "../entities";
import fs from "node:fs";
import path from "node:path";
import { exitCode } from "node:process";

class JsonProjectStore {
    constructor(private readonly filePath:string) {}
    
    exists(){
        return fs.existsSync(this.filePath)
    }

    read(){
        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        return new Project(data)
    }

    // write()
};