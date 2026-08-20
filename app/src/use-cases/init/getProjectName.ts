import readline from "node:readline/promises"

export default async function getProjectName(rl:readline.Interface):Promise<string>{
    while (true) {
        let projectName:string = await rl.question("what is the name of your project?: ")
        if (projectName.length > 100){
            console.log("project name cant be more than 100 chars")
        } else {
            return projectName
        }
    };
}