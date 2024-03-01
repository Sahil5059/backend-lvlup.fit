//imports
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import heroRouter from "./routes/hero.route";
import youtubeVideoRouter from "./routes/youtubeVideo.route";
import contactUsRouter from "./routes/contactUs.route";

//1(a).creating-server
export const app = express();
//now move to "./server.ts"

//2(a).setting-up-our-api
app.use(express.json({limit: "50mb"})); //important for cloudinary
app.use(cookieParser());
//now, go to the ".env" file in the and add the following line: "ORIGIN = ['http://localhost:3000']" and then come back here
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));

//7(f).setting-up-user-login
app.use("/api/v1", userRouter);
//now, move to "user.controller.ts"

//16(d).edit-hero-data
app.use("/api/v1", heroRouter);
//now, move to youtubeVideo.model.ts in the "models" folder

//17(c).edit-youtue-video-data
app.use("/api/v1", youtubeVideoRouter);
//now, move to contactUs.model.ts in the "models" folder

//18(c).edit-contact-us-data
app.use("/api/v1", contactUsRouter);
//

app.get("/test", (req:Request, res:Response, next:NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working!!",
    });
});
//as per my knowledge, any route which lies below "app.all" will not work, so, always keep it at the end of the routes
app.all("*", (req:Request, res:Response, next:NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statuscode = 404;
    next(err); //transferring the error to "ErrorHandler.ts"(which will be created later)
});
//now you can type "http://localhost:8000/test" in your browser to see that the api is working or not. Note that "app.all" won't work currently because we have not creted our "ErrorHandler.ts" file yet. So, you will probably get an ugly error message when trying to accesss any route other than "http://localhost:8000/test"
//now, move to ./utils/db.ts

//4(c).setting-up-error-handling
app.use(ErrorMiddleware);
//now, we will create a middleware for handling "async" errors
//now, move to "catchAsyncErrors.ts" in the "middleware" folder 