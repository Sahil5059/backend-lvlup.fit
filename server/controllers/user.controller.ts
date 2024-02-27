//imports
require('dotenv').config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";
import { sendToken } from "../utils/jwt";

//6(a).setting-up-user-registration & activation and then deleting this section of code because we no longer need it
//now, move to user.model.ts

//7(b).setting-up-user-login
interface ILoginRequest{
    email: string;
    password: string;
}
export const loginUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, password} = req.body as ILoginRequest;
        if(!email || !password){
            return next(new ErrorHandler("Please enter email and password", 400));
        }
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid email or password", 400));
        };
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return next(new ErrorHandler("Invalid password", 400));
        }

        //7(d).setting-up-user-login
        sendToken(user, 200, res);
        //now, move to "user.route.ts" in the "routes" folder

    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "jwt.ts" in the "utils" folder
