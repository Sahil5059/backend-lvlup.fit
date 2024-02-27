//imports
import { Response } from "express";
import userModel from "../models/user.model";

//10(a).setting-up-code-to-get-user-info
export const getUserById = async(id:string, res:Response) => {
    const user = await userModel.findById(id);
    if(user){
        res.status(201).json({
            success: true,
            user,
        });
    }else{
        res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
}
//now, move to "user.controller.ts" inside the "controllers" folder