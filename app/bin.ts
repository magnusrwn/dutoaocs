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
    updateAllDocs,
    showHelp,
    clearDeadAllDocs,
    clearDeadAllContext,
    listItems
} from "./src/controllers/index"


const command:Array<string> = process.argv.slice(2)
const userLocation:string = process.cwd()

async function main(){
    switch (command[0]){
        case "--help":{
            showHelp()
            break
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


        // crud doc files
        case "add-doc-file":{
            addDocFile(command, userLocation)
            break
        }
        case "rem-doc-file":{
            removeDocFile(command, userLocation)
            break
        }
        case "clear-docs":{
            clearDeadAllDocs(userLocation)
            break
        }
        case "list-docs":{
            listItems(userLocation, "docs", "")
            break
        }

        // crud context
        case "add-context":{
            addContext(command, userLocation)
            break
        }
        case "rem-context":{
            removeContext(command, userLocation)
            break
        }
        case "clear-context":{
            clearDeadAllContext(userLocation)
            break
        }
        case "list-context":{
            listItems(userLocation, "context", command[1] ?? "")
            break
        }

        // updaters
        case "update-doc":{
            await updateDocs(command, userLocation)
            break
        }
        case "update-all":{
            await updateAllDocs(userLocation)
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
