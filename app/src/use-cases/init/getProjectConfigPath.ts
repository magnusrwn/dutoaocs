import readline from "node:readline/promises"
import fs from "node:fs"
import { config } from "node:process"

export default async function getProjectConfigPath(userLocation:string, rl:readline.Interface):Promise<string>{
    while (true){
        const configPathChoice:string = (await rl.question("would you like to place 'dutoaocs.config.json' at your current location? (y/n): ")).toLocaleLowerCase()
        if (["yes", "y"].includes(configPathChoice)){
            const configPath:string = userLocation + "dutoaocs.config.json"
            return configPath
        } else if (["no", "n"].includes(configPathChoice)){
            while (true){
                console.log("when inputing file path do noto include 'dautoaocs.config.json' at the end")
                let customConfigPath:string = await rl.question("input full path here: ")
                if (fs.existsSync(customConfigPath)){
                    const configPath:string = customConfigPath + "dutoaocs.config.json"
                    return configPath
                } else {
                    console.log(`path: ${customConfigPath} does not exist`)
                }
            }
        } else {
            console.log("please input 'yes'/'y' or 'no'/'n'")
        }
    }
}