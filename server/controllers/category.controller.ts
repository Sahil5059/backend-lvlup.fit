//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CategoryLayout from "../models/categories.model";

//23(b).categories
interface ICategoryData{
    categories: Array< string >;
}
export const categories = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { categories } = req.body as ICategoryData;
        if( categories == null ){
            return next(new ErrorHandler( "Insufficient Data", 400 ));
        }
        const data:ICategoryData = {
            categories,
        }
        await CategoryLayout.deleteOne();
        await CategoryLayout.create( data );
        res.status( 201 ).json({
            success: true,
            message: "Data created successfully",
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
//now, move to "category.route.ts"
