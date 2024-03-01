//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { editYoutubeVideo } from "../controllers/youtubeVideo.controller";

//17(b).edit-youtue-video-data
const youtubeVideoRouter = express.Router();
youtubeVideoRouter.put('/edit-youtube-video', isAuthenticated(), editYoutubeVideo);
export default youtubeVideoRouter;
//now, move to "app.ts"