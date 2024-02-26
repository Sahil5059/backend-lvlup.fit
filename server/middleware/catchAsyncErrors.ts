//imports
import { NextFunction, Request, Response } from "express";

//4(d).setting-up-error-handling
export const CatchAsyncError = (yourfunction:any) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(yourfunction(req, res, next)).catch(next);
}
//we will now start creating "user model"
//now, move to "user.model.ts" in the "models" folder
