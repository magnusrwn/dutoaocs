export default function rollbackDotenv():void{
    if(process.env.OPENAI_API_KEY){
        delete process.env.OPENAI_API_KEY
    }    
    return 
}