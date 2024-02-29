//8(b).setting-up-user-logout
//here, we are basically setting up a security guard who will first verify the "access_token" and if verified, he will provide "user" data to "req.user"
import { Request,Response,NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";
export const isAuthenticated = (custom_message?:string) => {
    return CatchAsyncError(async(req:Request, res:Response, next: NextFunction) => {
        try {
            const access_token = req.cookies.access_token as string;
            if(!access_token && custom_message){
                return next(new ErrorHandler(`${custom_message}`, 400));
            }
            if(!access_token){
                return next(new ErrorHandler('Please login to access this resource', 400));
            }
            const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload; //this will first verfiy the access_token and if verified, then it will store the information (which we stored inside the "jwt") as "payload" inside the const: "decoded". console log the "decoded" constant to see it's contents.
            if(!decoded){
                return next(new ErrorHandler("Access token is not valid", 400));
            }
            const user = await userModel.findById(decoded.id);
            if(!user){
                return next(new ErrorHandler('User not found', 400));
            }
            //now, watch: 3:16:35 to 3:18:15 from: "https://youtu.be/kf6yyxMck8Y?si=FYVJGRRz2QfCgyhU" to fix error that is going to occur below
            req.user = user;
            req.user_not_for_login = user;
            next();
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400));
        }
    });
}
    