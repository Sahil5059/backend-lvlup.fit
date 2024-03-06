//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import StoreItemLayout from "../models/storeItem.model";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

//22(b)store
interface IImage{
    public_id: string;
    url: string;
}
interface IStoreItem{
    title: string;
    originalPrice: number;
    reducedPrice?: number;
    description: Array< string >;
    images: Array< IImage >;    
}
export const createStoreItem = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { title, originalPrice, reducedPrice, description, photos } = req.body as any;
        if( title == null || originalPrice == null || description.length === 0 || photos.length === 0 ){
            return next( new ErrorHandler( "Insufficient Data", 400 ));
        }
        const images:any[] = await Promise.all( photos.map( async( item:any, index:any ) => {
            const myCloud = await cloudinary.v2.uploader.upload( item, {
                folder: "Store",
                width: 150,
            });
            const imageData = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
            return (
                imageData
            )
        }));
        const data:IStoreItem = {
            title,
            originalPrice,
            reducedPrice,
            description,
            images,
        }
        await StoreItemLayout.create(data);
        res.status( 201 ).json({
            success: true,
            message: "Data created successfully",
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
export const editStoreItem = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const storeItemId = req.params.id;
        const originalData = await StoreItemLayout.findById( storeItemId ) as any;
        if( originalData == null ){
            return next( new ErrorHandler( "Store-item not found", 404 ));
        }
        const { title, originalPrice, reducedPrice, description, photos } = req.body as any;
        if( title == null || originalPrice == null || description.length === 0 || photos.length === 0 ){
            return next( new ErrorHandler( "Insufficient Data", 400 ));
        }
        const images:any[] = await Promise.all( photos.map( async( item:any, index:any ) => {
            if( !item.public_id ){
                await cloudinary.v2.uploader.destroy( originalData.images[index].public_id );
                const myCloud = await cloudinary.v2.uploader.upload( item, {
                    folder: "Store",
                    width: 150,
                });
                const imageData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
                return (
                    imageData
                )
            }else{
                const imageData = {
                    public_id: item.public_id,
                    url: item.url,
                }
                return (
                    imageData
                )
            }
        }));
        const data:IStoreItem = {
            title,
            originalPrice,
            reducedPrice,
            description,
            images,
        }
        const storeItemEdit = await StoreItemLayout.findByIdAndUpdate( storeItemId , { $set: data }, { new: true });
        res.status( 201 ).json({
            success: true,
            storeItemEdit,
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
export const deltedStoreItem = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const storeItemId = req.params.id;
        const originalData = await StoreItemLayout.findById( storeItemId ) as any;
        if( originalData == null ){
            return next( new ErrorHandler( "Store-item not found", 404 ));
        }
        await originalData.deleteOne({ storeItemId });
        await Promise.all( originalData.images.map( async( item:any, index:any ) => {
            await cloudinary.v2.uploader.destroy(item.public_id);
        }));
        res.status( 200 ).json({
            success: true,
            message: "Store item deleted successfully",
        })
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
interface IOrderItem {
    productName: string;
    originalPrice: number;
    quantity: number;
    itemTotalPrice: number;
}
interface IOrderDetailsData{
    name: string;
    address: string;
    phoneNumber: number;
    itemList: IOrderItem[];
    subtotal: number;
    totalDiscount: number;
    total: number;
}
export const sendOrderDetails = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const { name, address, phoneNumber, itemList, subtotal, totalDiscount, total } = req.body as IOrderDetailsData;
        if( name == null || address == null || phoneNumber == null || itemList.length === 0){
            return next( new ErrorHandler( "Insufficient Data", 400 ));
        }
        const data:IOrderDetailsData = {
            name,
            address,
            phoneNumber,
            itemList,
            subtotal,
            totalDiscount,
            total
        }
        const html = await ejs.renderFile( path.join(__dirname, "../mails/invoice-mail.ejs"), data );
        //now, move to "sendMail.ts" inside the "utils" folder, code in it and then come back here
        try {
            await sendMail({
                email: "dedicatedgamer59@gmail.com",
                subject: "Invoice",
                template: "invoice-mail.ejs",
                data,
            });
            res.status( 201 ).json({
                success:true,
                message: "Invoice sent successfully"
            });
        }catch( error:any ){
            return next( new ErrorHandler( error.message, 500 ));
        }
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
})
//now, move to "storeItem.route.ts" in the "routes" folder