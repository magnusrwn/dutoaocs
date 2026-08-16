import Entity from "./entity";

type UserAttrs = {
    id?: number;
    profileName?:string;
    llmInfo?: {
        provider?:"claude" | "openai";
        linked?:boolean;
        auth_token?:string;
    }
    dateJoined?:string; // check if dates are a good type for ts    
};

export default class User extends Entity<UserAttrs>{
    id!: number;
    profileName?:string;
    llmInfo?: {
        provider?:"claude" | "openai";
        linked?:boolean;
        auth_token?:string;
    }
    dateJoined?:string; // check if dates are a good type for ts
};