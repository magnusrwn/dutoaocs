import { Project } from "../entities/index";
import rl from "node:readline/promises"

export default async function addLlm(rl:rl.Interface, proj:Project){
    console.log("currently we integrate 'calude' or 'openAI' models")
    const llmType = (await rl. question("Which model do you run? ('calude'/'openAI'): ")).toLowerCase()

    // init process based on the chosen model
}