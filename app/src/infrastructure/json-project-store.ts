import { Project, LlmProfile } from "../entities/index";
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
    
    updateConfig<K extends keyof Project>(fieldName:K, newData:Project[K]):boolean{
        // ensure config exists
        if (!this.exists()){
            return false
        }

        // grab the proj
        const data: Project = this.read()
        if (!data){
            return false
        }

        // edit and write data field
        data[fieldName] = newData
        this.write(data)
        
        return true
    }
    
    updateConfigLlmLinked(newLlmData:LlmProfile):boolean{
        // Created this as need to update Project.llmLinked to be true after llm info update
        const status = this.updateConfig("llmProfile", newLlmData)
        if (status){
            const data = this.read()
            data.llmLinked = true
            this.write(data)
            return true
        } else {
            return false
        }
    }
};