//imports
require('dotenv').config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

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
            return next(new ErrorHandler("Invalid email or password", 401));
        };
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return next(new ErrorHandler("Invalid password", 401));
        }

        //7(d).setting-up-user-login
        sendToken(user, 200, res);
        //now, move to "user.route.ts" in the "routes" folder

    } catch ( error:any ) {
        return next(new ErrorHandler(error.message, 500));
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
    } catch ( error:any ) {
        return next(new ErrorHandler(error.message, 500));
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
    } catch ( error:any ) {
        return next(new ErrorHandler(error.message, 500));
    }
});
//now, move to "user.route.ts" in the "routes" folder

//10(b).setting-up-code-to-get-user-info
export const getUserInfo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.user?._id;
        if(userId == null){
            return next(new ErrorHandler('Could not find user', 404));
        }
        getUserById(userId, res);
    } catch ( error:any ) {
        return next(new ErrorHandler(error.message, 500));
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
        if(name == null && email == null){
            return next(new ErrorHandler("Data can't be empty", 400));
        }
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
    } catch ( error:any ) {
        return next(new ErrorHandler(error.message, 500));
    }
});
//now, move to "user.route.ts" in the "routes" folder

//13(a).update-user-password
interface IUpdatePassword{
    oldPassword: string;
    newPassword: string;
}
export const updatePassword = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {oldPassword, newPassword} = req.body as IUpdatePassword;
        if(!oldPassword || !newPassword){
            return next(new ErrorHandler("Please enter old and new password", 400));
        }
        const user = await userModel.findById(req.user?._id).select("+password");
        if(user?.password === undefined){
            return next(new ErrorHandler("Invalid user", 400));
        }
        const isPasswordMatch = await user?.comparePassword(oldPassword);
        if(!isPasswordMatch){
            return next(new ErrorHandler("Invalid old password", 401));
        }
        user.password = newPassword;
        await user.save();
        res.status(201).json({
            success: true,
            user,
        });
    } catch ( error:any ) {
        return next(new ErrorHandler(error.message, 500));
    }
});
//now, move to "user.route.ts" in the "routes" folder

//14(a).update-user-avatar
//open the "server" folder terminal and type: "npm i cloudinary"
interface IUpdateProfilePicture{
    avatar: string;
}
export const updateProfilePicture = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {avatar} = req.body as IUpdateProfilePicture;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
        if(avatar && user){
            if(user?.avatar?.public_id){
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }else{
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }
        }
        if(avatar == null){
            return next(new ErrorHandler("Please give a profile picture to upload", 400));
        }
        await user?.save();
        res.status(200).json({
            success: true,
            user
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//now, move to "server.ts"

//15(a).forgot-password
interface IActivationToken{
    token: string;
    activationCode: string;
}
export const createActivationToken = (user:any):IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret, //you will get an error if you don't write "as Secret"
        {
        expiresIn: "1m",
        }
    );
    return {token,activationCode};
}
interface IVerifyUserEmail{
    email: string;
}
export const verifyUserEmail = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {email} = req.body as IVerifyUserEmail;
        if(email == null){
            return next(new ErrorHandler('Please enter your registered email', 400));
        }
        const user = await userModel.findOne({email});
        if(!user){
            return next(new ErrorHandler("User not found", 404));
        }
        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = {
            user: {
                name:user.name,
            },
            activationCode,
        }
        //open the "server" folder in terminal and type: "npm i ejs nodemailer --save-dev @types/ejs --save-dev @types/nodemailer"
        //now, create a folder named "mails" and a then create file inside it named "activation-mail.ejs", write the necessary code for the template that email and then come back here.
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);
        //now, move to "sendMail.ts" inside the "utils" folder, code in it and then come back here
        try {
            await sendMail({
                email: user.email,
                subject: "Reset Your Password",
                template: "activation-mail.ejs",
                data,
            });
            res.status(201).json({
                success:true,
                activationCode: activationCode,
                activationToken: activationToken.token,
                user_not_for_login: user,
            });
        } catch (error:any) {
            return next(new ErrorHandler(error.message,400));
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
interface IActivationRequest{
    activation_token: string;
    activation_code: string;
}
export const activateOtp = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {activation_token, activation_code} = req.body as IActivationRequest;
        if(activation_token == null || activation_code == null){
            return next(new ErrorHandler("Data can't be empty", 400));
        }
        const userData:{user:IUser; activationCode:string} = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string) as {user:IUser; activationCode:string};
        if(userData.activationCode !== activation_code){
            return next(new ErrorHandler('Invalid activation code', 401));
        }
        res.status(201).json({
            success:true,
            message: "OTP activated successfully"
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
interface IResetPassword{
    new_password: string;
    activation_token: string;
}
export const resetPassword = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { new_password, activation_token } = req.body as IResetPassword;
        if( !new_password || !activation_token ){
            return next(new ErrorHandler("Insufficient data", 400));
        }
        const userData:{ user:IUser; activationCode:string } = jwt.verify( activation_token, process.env.ACTIVATION_SECRET as string ) as { user:IUser; activationCode:string };
        const userId = userData.user._id;
        const userInfo:any = await userModel.findById( userId ).select( "+password" );
        userInfo.password = new_password;
        await userInfo.save();
        res.status(201).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


