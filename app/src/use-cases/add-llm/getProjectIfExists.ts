import { Project, ProjectAttrs } from "../../entities/index"
import fs from "node:fs"


export default function getProjectIfExists(path:string):Project | undefined{
    // normalise
    console.log(path)
    if (!path.endsWith("dutoaocs.config.json")){
        if (path.endsWith("/")){
            path += "dutoaocs.config.json"
        } else {
            path += "/dutoaocs.config.json"
        }
    }

    // try read, on catch return void
    try{
        const raw:string = fs.readFileSync(path, 'utf-8')
        const json_proj:ProjectAttrs = JSON.parse(raw)
        const project:Project = new Project(json_proj)
        return project
    } catch{
        return undefined
    }
}