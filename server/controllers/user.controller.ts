//imports
require('dotenv').config();
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model";

//6(a).setting-up-user-registration & activation and then deleting this section of code because we no longer need it

