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
export const getHeroData = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const heroData:any = await HeroLayout.findOne({});
        res.status( 200 ).json({
            success: true,
            heroData,
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
})

export const editHeroData = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const heroData:any = await HeroLayout.findOne({});
        const { heading, description } = req.body as IHeroData;
        if( heading == "" || description == "" ){
            return next( new ErrorHandler( "Insufficient data", 400 ));
        }
        const data:IHeroData = {
            heading,
            description,
        }
        await HeroLayout.findByIdAndUpdate( heroData._id, { $set: data }, { new: true } );
        res.status( 200 ).json({
            success: true,
            message: "Hero updated successfully",
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
//now, move to hero.route.ts in the "routes" folder
