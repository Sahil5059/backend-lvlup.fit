//imports
import { Request } from "express";
import { IUser } from "../models/user.model";
//here, we are basically extending the "Request" interface in the "express" module to include a new property called "user", which will be of type "IUser" or undefined.
declare global{
    namespace Express{
        interface Request{
            user?: IUser //It's marked as optional, meaning it may or may not be present in a request. If present, it will be of type "IUser", representing user information.
        }
    }
}