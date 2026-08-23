export default function showApiLinksteps(){
    console.log("Currently we integrate use the OpenAI API. To integrate the key follow these steps.")
    console.log("I promise, it's super easy.")

    // llm logic
    console.log("1. Go to https://platform.openai.com/home, OpenAI's API dashboard.")
    console.log("2. Follow steps on the dashobard, and click on create API key.")
    console.log("2.1. Name your new API key (this can be anything, but I would make it 'dutoaocs', as this is ts use)")
    console.log("3. Copy your newly created API key, and head back here")
    console.log("3.1. [!! IMPORTANT !!] Create files called '.env' and '.gitignore' in this projects root")
    console.log("3.2. In '.env', add this line of code: OPENAI_API_KEY='PUT YOUR-REAL-KEY-HERE', and put your new, real key where it says")
    console.log("3.1. [!! VERY IMPORTANT !!] In '.gitignore', add the following line of code: '.env'")
}