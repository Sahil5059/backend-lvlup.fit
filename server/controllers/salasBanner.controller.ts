//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import SalesBannerLayout from "../models/salesBanner.model";

//21(b).sales-banner
interface ISalesBanner{
    title: string;
    description: string;
}
export const createSalesBanner = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { title, description } = req.body as ISalesBanner;
        if( title == null || description == null ){
            return next( new ErrorHandler( "Insufficient data", 400 ));
        }
        const data:ISalesBanner = {
            title,
            description,
        }
        const isSalesBannerExist = await SalesBannerLayout.findOne();
        if( isSalesBannerExist ){
            return next( new ErrorHandler( "A sales banner already exisits", 400 ));
        }
        await SalesBannerLayout.create( data );
        res.status( 201 ).json({
            success: true,
            message: "Data created successfully",
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
export const editSalesBanner = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { id } = req.params;
        const salesBanner = await SalesBannerLayout.findById( id );
        if( salesBanner == null ){
            return next(new ErrorHandler( "Sales banner not found", 404 ));
        }
        const { title, description } = req.body as ISalesBanner;
        if( title == null || description == null ){
            return next( new ErrorHandler( "Insufficient data", 400 ));
        }
        const data:ISalesBanner = {
            title,
            description,
        }
        await SalesBannerLayout.findByIdAndUpdate( id, { $set: data }, { new: true });
        res.status( 201 ).json({
            success: true,
            message: "Data edited successfully",
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
export const deleteSalesBanner = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { id } = req.params;
        const salesBanner = await SalesBannerLayout.findById( id );
        if( salesBanner == null ){
            return next(new ErrorHandler( "Sales banner not found", 404 ));
        }
        await salesBanner.deleteOne({ id });
        res.status( 200 ).json({
            success: true,
            message: "Data deleted successfully",
        });
    } catch (error:any) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
//now, move to "salesBanner.route.ts" in the "routes" folder