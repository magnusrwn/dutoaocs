import { Project } from "../entities/index";
import { getProjectIfExists, showApiLinksteps } from "../use-cases/add-llm/index";


export default async function addLlmLink(userLocation: string){
    // find project
    const project:Project | undefined = getProjectIfExists(userLocation)
    if (!project){
        console.log("No 'dutoaocs.config.json' was found. Make sure you are at the project root and/ or run 'dutoaocs init' to create one")
        return
    }

    // show linnking steps
    showApiLinksteps()
    
    // cap steps with final console log directing to next step
    console.log("\nOnce complete, run 'dutoaocs add-llm --verify'")
}
