import { User } from "../entities";

export interface UserStore{
    exists():boolean;
    read():User;
    write(user:User):void;
}