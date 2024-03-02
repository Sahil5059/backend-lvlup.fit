//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import PricingLayout from "../models/pricing.model";
import ErrorHandler from "../utils/ErrorHandler";

//19(b).edit-pricing
interface IPricingStructure{
    basic: number;
    special: number;
    premium: number;
}
interface IPricingPlan{
    monthly: IPricingStructure,
    yearly: IPricingStructure,
}
//now, I had first set up the code to create pricing data but I have deleted it because we no longer need it
export const editPricing = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    const pricingData = await PricingLayout.find();
    const { monthly, yearly } = req.body as IPricingPlan;
    if( !monthly && !yearly ){
        return next(new ErrorHandler( "Insufficient Data", 400 ));
    }
    const data:IPricingPlan = {
        monthly: {
            basic: monthly.basic,
            special: monthly.special,
            premium: monthly.premium,
        },
        yearly: {
            basic: yearly.basic,
            special: yearly.special,
            premium: yearly.premium,
        }
    }
    for( const [ key, value ] of Object.entries( monthly )){
        if ( value == null ) {
            return next(new ErrorHandler(`${value} can't be empty`, 400));
        }
    }
    for( const [ key, value ] of Object.entries( yearly )){
        if ( value == null ) {
            return next(new ErrorHandler(`${value} can't be empty`, 400));
        }
    }
    await PricingLayout.findByIdAndUpdate ( pricingData[0]._id, { $set: data }, { new: true });
    res.status( 200 ).json({
        success: true,
        message: "Pricing created successfully",
    });
});
//now, move to "pricing.route.ts" in the "routes" folder