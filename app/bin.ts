#!/usr/bin/env node

import { init, addLlm } from "./src/controllers/index"

const command:Array<string> = process.argv.slice(2)
const userLocation:string = process.argv[0]

switch (command[0]){
    case "init":{
        init(userLocation)
    }
    case "add-llm":{
        addLlm(command, userLocation) // note on this
    }
}
