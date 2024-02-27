//imports
import express from "express";
import { loginUser } from "../controllers/user.controller";

//7(e).setting-up-user-login
const userRouter = express.Router();
userRouter.post('/login', loginUser);
export default userRouter;
//now, move to "app.ts"