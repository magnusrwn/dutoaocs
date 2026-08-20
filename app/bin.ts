#!/usr/bin/env node

import { init } from "./src/controllers/index"

const [command] = process.argv.slice(2)
const userLocation:string = process.argv[0]

switch (command){
    case "init":{
        init(userLocation)
    }
}
