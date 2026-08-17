import { User } from "../entities";
import fs from "node:fs"

export default class JsonUserStore {
    constructor(private readonly filePath:string) {}
    exists(){
        return fs.readFileSync(this.filePath)
    }
    read(){
        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'))
        return data
    }
    write(user:User){
        return fs.writeFileSync(this.filePath, JSON.stringify(user))
    }
}