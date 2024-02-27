//imports
import express from "express";
import { loginUser, logoutUser } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

//7(e).setting-up-user-login
const userRouter = express.Router();
userRouter.post('/login', loginUser);

//8(c).setting-up-user-logout
userRouter.get('/logout', isAuthenticated, logoutUser);
//now, move to "user.contoller.ts" in the "controllers" folder

export default userRouter;
//now, move to "app.ts"