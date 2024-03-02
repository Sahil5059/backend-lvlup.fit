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
export const editYoutubeVideo = CatchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const videoData:any = await YoutubeVideoLayout.find();
    const {link, heading, description} = req.body as IYoutubeVideoData;
    if(link == null || heading == null || description == null){
        return next(new ErrorHandler("Data can't be empty", 400));
    }
    const data:IYoutubeVideoData = {
        link,
        heading,
        description,
    }
    await YoutubeVideoLayout.findByIdAndUpdate(videoData[0]._id, { $set: data }, { new: true });
    res.status(200).json({
        success: true,
        message: "Video updated successfully",
    });
});
//now, move to "youtubeVideo.route.ts" inside the "routes" folder