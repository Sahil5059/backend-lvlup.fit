//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { editYoutubeVideo, getYoutubeVideo } from "../controllers/youtubeVideo.controller";

//17(b).edit-youtue-video-data
const youtubeVideoRouter = express.Router();
youtubeVideoRouter.get('/get-youtube-video', isAuthenticated(), getYoutubeVideo);
youtubeVideoRouter.put('/edit-youtube-video', isAuthenticated(), editYoutubeVideo);
export default youtubeVideoRouter;
//now, move to "app.ts"