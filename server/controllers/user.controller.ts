//imports
require('dotenv').config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { getUserById } from "../services/user.service";

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

//8(a).setting-up-user-logout
export const logoutUser = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        res.cookie("access_token", "", {maxAge:1});
        res.cookie("refresh_token", "", {maxAge:1});
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "auth.ts" in the "middleware" folder

//9(a).setting-up-code-to-update-access_token
export const updateAccessToken = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;
        const message = 'Could not refresh token';
        if(!decoded){
            return next(new ErrorHandler(message, 400));
        }
        const session = await userModel.findById(decoded.id);
        if(!session){
            return next(new ErrorHandler("Please login to access this resource", 400));
        }
        const user = session;
        const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN as string, {expiresIn:"5m"});
        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN as string, {expiresIn: "3d"}); //note that in the ".env" file, we had named "REFRESH_TOKEN_SECRET" as "REFRESH_TOKEN", so don't get confused, it is "REFRESH_TOKEN_SECRET" even though we named it "REFRESH_TOKEN" by mistake. Same goes for "ACCESS_TOKEN" in the ".env" file.
        req.user = user;
        res.cookie("access_token", accessToken, accessTokenOptions); //don't forget to import "accessTokenOptions"
        res.cookie("refresh_token", refreshToken, refreshTokenOptions); //don't forget to import "refreshTokenOptions"
        res.status(200).json({
            status: "success",
            accessToken,
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "user.route.ts" in the "routes" folder

//10(b).setting-up-code-to-get-user-info
export const getUserInfo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.user?._id;
        getUserById(userId, res);
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "user.route.ts" in the "routes" folder

//11(a).setting-up-social-auth
interface ISocialAuthBody{
    email: string;
    name: string;
    avatar: string;
}
export const socialAuth = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, name, avatar} = req.body as ISocialAuthBody;
        const user = await userModel.findOne({email});
        if(!user){
            const newUser = await userModel.create({email, name, avatar});
            sendToken(newUser, 200, res);
        }
        else{
            sendToken(user, 200, res);
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "user.route.ts" in the "routes" folder

//12(a).update-user-info
interface IupdateUserInfo {
    name?: string;
    email?: string;
}
export const updateUserInfo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {name, email} = req.body as IupdateUserInfo;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
        if(name && user){
            user.name = name;
        }
        if(email && user){
            const existingUser = await userModel.findOne({ email });
            if(existingUser && existingUser._id !== userId){
                return next(new ErrorHandler("Email already exists", 400));
            }
            user.email = email;
        }
        await user?.save();
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "user.route.ts" in the "routes" folder
