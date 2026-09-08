#!/usr/bin/env node

import "dotenv/config"
import {
    init,
    addLlmLink,
    addLlmVerify,
    addContext,
    addDocFile,
    removeContext,
    removeDocFile,
    updateDocs,
    showHelp
} from "./src/controllers/index"


const command:Array<string> = process.argv.slice(2)
const userLocation:string = process.cwd()

async function main(){
    switch (command[0]){
        case "--help":{
            showHelp()
        }
        case "init":{
            await init(userLocation)
            break
        }

        case "add-llm":{
            // verifyer func
            if (command.includes("--verify")){
                await addLlmVerify(userLocation)
            }
            
            // addition steps
            await addLlmLink(userLocation)
            break
        }


        // crud doc files to project
        case "add-doc-file":{
            addDocFile(command, userLocation)
            break
        }
        case "rem-doc-file":{
            removeDocFile(command, userLocation)
            break
        }

        // crud allowed context for those projects above
        case "add-context":{
            addContext(command, userLocation)
            break
        }
        case "rem-context":{
            removeContext(command, userLocation)
            break
        }

        case "update-doc":{
            await updateDocs(command, userLocation)
            break
        }
        case "update-all":{
            // todo
            break
        }

        // defualt resp on bad command
        default:{
            console.log(`unknown command "${command[0] ?? ""}"`)
            break
        }
    }
}

main()
