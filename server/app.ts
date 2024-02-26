//imports
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";

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
app.get("/test", (req:Request, res:Response, next:NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working bro!!",
    });
});
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