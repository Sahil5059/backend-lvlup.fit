//imports
require('dotenv').config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";

//6(a).setting-up-user-registration
interface IRegistrationBody{
    name: string;
    email: string;
    password: string;
}
interface IActivationToken{
    activationCode: string;
    token: string;
}
export const createActivationToken = (user:any):IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret, //you will get an error if you don't write "as Secret" in the above line. Also, "ACTIVATION_SECRET" can be any random number you wish
        {
            expiresIn: "5m",
        }
    );
    return {activationCode, token}
}
export const registrationUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {name, email, password} = req.body;
        const user:IRegistrationBody = {
            name,
            email,
            password,
        }
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        try {
            if(user.name == null || user.email == null ||  user.password == null){
                res.status(404).json({
                    success:false,
                    message: "Insufficient data"
                });
            }else{
                res.status(201).json({
                    success:true,
                    activationCode: activationCode,
                    activationToken: activationToken.token,
                });
            }
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400));
        }
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));        
    }
});
//now, move to "user.route.ts" in the "routes" folder

//6(d).setting-up-user-registration
interface IActivationRequest{
    activation_code: string;
    activation_token: string;
}
export const activateUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {activation_code, activation_token} = req.body as IActivationRequest;
        const newUser:{user:IUser; activationCode:string} = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string) as {user:IUser; activationCode:string}
        if(newUser.activationCode !== activation_code){
            return next(new ErrorHandler("Invalid activation code", 400));
        }
        const {name, email, password} = newUser.user;
        const userExists = await userModel.findOne({email});
        if(userExists){
            return next(new ErrorHandler("Email already exists", 400));
        }
        const user = await userModel.create({
            name,
            email,
            password
        });
        res.status(201).json({
            success: true,
        })
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "user.route.ts" in the "routes"