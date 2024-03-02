//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import ContactUsLayout from "../models/contatctUs.model";

//18(b).edit-contact-us-data
interface IContactUsData{
    address: string;
    email: string;
    phoneNumber: number;
}
//first, I created the data for contactUs and now, I have removed it from the code because we no longer need it.
export const editContactUs = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const contactUsData:any = await ContactUsLayout.find();
    const {address, email, phoneNumber} = req.body as IContactUsData;
    if(address == null || email == null || phoneNumber == null){
        return next(new ErrorHandler("Data can't be empty", 400));
    }
    const data:IContactUsData = {
        address,
        email,
        phoneNumber,
    }
    await ContactUsLayout.findByIdAndUpdate(contactUsData[0]._id, { $set: data }, { new: true });
    res.status(200).json({
        success: true,
        message: "Contact-Us updated successfully",
    });
});
//now, move to "contactUs.route.ts" inside the "routes" folder