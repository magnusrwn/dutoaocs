#!/usr/bin/env node

import "dotenv/config"
import { init, addLlmLink, addLlmVerify } from "./src/controllers/index"


const command:Array<string> = process.argv.slice(2)
const userLocation:string = process.cwd()

async function main(){
    switch (command[0]){
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
    }
}

main()