//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import TransformationLayout from "../models/transformation.model";
import cloudinary from "cloudinary";

//20(b).transformation
interface ITransformationData{
    photo: {
        public_id: string;
        url: string;
    },
    title: string;
    description: string;
    name: string;
    profession: string;
}
export const createTransformation = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const { picture, title, description, name, profession } = req.body as any;
    if( !picture || !title || !description || !name || !profession ){
        return next( new ErrorHandler( "Insufficient data", 400 ));
    }
    const myCloud = await cloudinary.v2.uploader.upload(picture, {
        folder: "transformations",
        width: 150,
    });
    const photo = {
        public_id: myCloud.public_id,
        url: myCloud.url,
    }
    const data:ITransformationData = {
        photo,
        title,
        description,
        name,
        profession,
    }
    await TransformationLayout.create( data );
    res.status( 200 ).json({
        success: true,
        message: "Transformation created successfully",
    });
});
export const editTransformation = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    const transformationId = req.params.id as any;
    const originalData = await TransformationLayout.findById( transformationId ) as any;
    const data = req.body as any;
    if( !data.photo || !data.title || !data.description || !data.name || !data.profession){
        return next( new ErrorHandler( "Insufficient data", 400 ));
    }
    const photo = data.photo as any;
    //setting up logic if the user is updating the transformation photo
    if( photo && !photo.url.startsWith( "https" )){
        await cloudinary.v2.uploader.destroy(originalData.photo.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(photo, {
            folder: "transformations",
            width: 150,
        });
        data.photo = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    //setting up logic if the user is not updating the transformation photo
    if( photo && photo.url.startsWith( "https" )){
        data.photo = {
            public_id: originalData?.photo.public_id,
            url: originalData?.photo.url,
        }
    }
    const transformationEdit = await TransformationLayout.findByIdAndUpdate( transformationId, { $set: data }, { new: true });
    res.status( 201 ).json({
        success: true,
        transformationEdit,
    });
});
//now, move to "transformation.route.ts" in the "routes" folder