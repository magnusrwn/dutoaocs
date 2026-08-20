import readline from "node:readline/promises"
import fs from "node:fs"

export default async function getProjectDocsPath(userLocation:string, rl:readline.Interface):Promise<string>{
    while (true){
        const docsPathQuestion:string = (await rl.question("do you already have a '/docs' in this proeject? (y/n): ")).toLocaleLowerCase()
        if (["yes", "y"].includes(docsPathQuestion)){
            let preVerifieddocsPath:string = (await rl.question("where is your current '/docs' folder?: "))
            if (preVerifieddocsPath.slice(-5) === "/docs"){
                console.log(`${preVerifieddocsPath} must end in "/docs"`)
                preVerifieddocsPath = (await rl.question("where is your current '/docs' folder?: "))
            }
            // verify path exists
            if (fs.existsSync(preVerifieddocsPath)){
                const docsPath = preVerifieddocsPath
                return docsPath
            } else {
                console.log(`${preVerifieddocsPath} does not exist`)
            }

        } else if (["no", "n"].includes(docsPathQuestion)){
            while (true){
                const createDocsFolderQuestion:string = (await rl.question("do you want to create '/docs' at your current location? (y/n): ")).toLocaleLowerCase()
                if (["yes", "y"].includes(createDocsFolderQuestion)){
                    const docsPath:string = userLocation + "/docs"
                    return docsPath
                } else if (["no", "n"].includes(createDocsFolderQuestion)){
                    while (true){
                        let customDocsFolderAddress:string = (await rl.question("what adress would you like to create your docs folder at?: "))
                        // normalise the input
                        if (customDocsFolderAddress.slice(-5) === "/docs"){
                            customDocsFolderAddress = customDocsFolderAddress.slice(-5)
                        }
                        // ensure path exists
                        if (fs.existsSync(customDocsFolderAddress)){
                            // make the '/docs' folder
                            const docsPath:string = customDocsFolderAddress += "/docs" 
                            return docsPath
                        }
                    }
                } else {
                    console.log("please input 'yes'/'y' or 'no'/'n'")        
                }
            }
        } else {
            console.log("please input 'yes'/'y' or 'no'/'n'")
        }
    }
}