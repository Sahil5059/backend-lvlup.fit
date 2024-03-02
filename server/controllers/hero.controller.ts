//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import HeroLayout from "../models/hero.model";

//16(b).edit-hero-data
interface IHeroData{
    heading: string;
    description: string;
}
//first, I created the data for hero and now, I have removed it from the code because we no longer need it.
export const editHeroData = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const heroData:any = await HeroLayout.find();
    const {heading, description} = req.body as IHeroData;
    if(heading == null || description == null){
        return next(new ErrorHandler("Data can't be empty", 400));
    }
    const data:IHeroData = {
        heading,
        description,
    }
    await HeroLayout.findByIdAndUpdate(heroData[0]._id, { $set: data }, { new: true });
    res.status(200).json({
        success: true,
        message: "Hero updated successfully",
    });
});
//now, move to hero.route.ts in the "routes" folder
