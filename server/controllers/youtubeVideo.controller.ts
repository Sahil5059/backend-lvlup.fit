//imports
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import YoutubeVideoLayout from "../models/youtubeVideo.model";

//17(a).edit-youtue-video-data
interface IYoutubeVideoData{
    link: string;
    heading: string;
    description: string;
}
//first, I created the data for youtubeVideo and now, I have removed it from the code because we no longer need it.
export const getYoutubeVideo = CatchAsyncError( async( req:Request, res:Response, next:NextFunction ) => {
    try {
        const videoData:any = await YoutubeVideoLayout.findOne({});
        res.status( 200 ).json({
            success: true,
            videoData,
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});

export const editYoutubeVideo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    try {
        const videoData:any = await YoutubeVideoLayout.findOne({});
        const {link, heading, description} = req.body as IYoutubeVideoData;
        if(link == "" || heading == "" || description == ""){
            return next(new ErrorHandler("Insufficient data", 400));
        }
        const data:IYoutubeVideoData = {
            link,
            heading,
            description,
        }
        await YoutubeVideoLayout.findByIdAndUpdate(videoData._id, { $set: data }, { new: true });
        res.status(200).json({
            success: true,
            message: "Video updated successfully",
        });
    } catch ( error:any ) {
        return next( new ErrorHandler( error.message, 500 ));
    }
});
//now, move to "youtubeVideo.route.ts" inside the "routes" folder