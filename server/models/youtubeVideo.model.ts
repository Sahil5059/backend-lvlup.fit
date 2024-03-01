//imports
import { Schema, model, Document } from "mongoose";

//17(a).edit-youtue-video-data
interface IYoutubeVideoData extends Document{
    link: string;
    heading: string;
    description: string;
}
const youtubeVideoData = new Schema<IYoutubeVideoData>({
    link: {
        type: String,
    },
    heading: {
        type: String,
    },
    description: {
        type: String,
    },
});
const YoutubeVideoLayout = model<IYoutubeVideoData>('youtubeVideo', youtubeVideoData);
export default YoutubeVideoLayout;
//now, move to youtubeVideo.controller.ts in the "controllers" folder