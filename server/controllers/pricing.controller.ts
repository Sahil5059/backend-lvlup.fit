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
    monthly: {
        originalPrice: IPricingStructure,
        reducedPrice?: any,
    },
    yearly: {
        originalPrice: IPricingStructure,
        reducedPrice?: any,
    },
}
//now, I had first set up the code to create pricing data but I have deleted it because we no longer need it
export const editPricing = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    const pricingData = await PricingLayout.find();
    const { monthly, yearly } = req.body as IPricingPlan;
    if( !monthly || !yearly ){
        return next(new ErrorHandler( "Insufficient Data", 400 ));
    }
    const data:IPricingPlan = {
        monthly: {
            originalPrice: {
                basic: monthly.originalPrice.basic,
                special: monthly.originalPrice.special,
                premium: monthly.originalPrice.premium,
            },
            reducedPrice: {
                basic: monthly?.reducedPrice?.basic,
                special: monthly?.reducedPrice?.special,
                premium: monthly?.reducedPrice?.premium,
            },
        },
        yearly: {
            originalPrice: {
                basic: yearly.originalPrice.basic,
                special: yearly.originalPrice.special,
                premium: yearly.originalPrice.premium,
            },
            reducedPrice: {
                basic: yearly?.reducedPrice?.basic,
                special: yearly?.reducedPrice?.special,
                premium: yearly?.reducedPrice?.premium,
            },
        },
    }
    for( const [ key, value ] of Object.entries( monthly.originalPrice )){
        if ( value == null ) {
            return next(new ErrorHandler(`${value} can't be empty`, 400));
        }
    }
    for( const [ key, value ] of Object.entries( yearly.originalPrice )){
        if ( value == null ) {
            return next(new ErrorHandler(`${value} can't be empty`, 400));
        }
    }
    await PricingLayout.findByIdAndUpdate ( pricingData[0]._id, { $set: data }, { new: true });
    res.status( 200 ).json({
        success: true,
        message: "Pricing updated successfully",
    });
});
//now, move to "pricing.route.ts" in the "routes" folder