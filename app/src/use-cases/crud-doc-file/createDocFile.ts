import { Project } from "../../entities";
import fs from "node:fs";
import { join } from "node:path";
// import { exec } from "node:child_process"

function validName(name:string):boolean{
    if (name[0] == "/" || name[0] =="."){
        return true;
    }
    const badChars:Array<string> = [
        "{", "}", "@", "!", "#", "$", "£", "%", "^", "&", "*",
        "(", ")", "|", "?", ".", "'",  '"', "`", ";", ":", "<",
        ">", ",", ".", "+", "="
    ];
    const badCharsSet:Set<string> = new Set(badChars);
    const result:boolean = [...name].some(char => badCharsSet.has(char))
    return !result
}

export default function createDocFile(docName:string, project:Project){
    if (validName(docName)){
        console.log("bad name input");
        console.log("doc name must consist: [ 'a-z', '-', '_']")
        console.log("\nfor example: 'my-doc-file'")
        console.log("note the absence of '.md'!")
    } else {
        const toWrite = join(project.docFolderPath, docName, ".md")
        try{
            fs.writeFileSync(toWrite, '', 'utf-8')
            console.log(`successfully wrote file at address ${toWrite}`)
        } catch (error){
            console.log(`ran into an error writing the file at address: ${toWrite}\nsee error below\n\n`)
            console.log(error)
            console.log("\n")
        }
    }
}
