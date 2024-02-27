//imports
import express from "express";
import { activateUser, registrationUser } from "../controllers/user.controller";

//6(b).setting-up-user-registration
const userRouter = express.Router();
userRouter.post('/registration', registrationUser);

//6(e).setting-up-user-registration
userRouter.post('/activate-user', activateUser);

export default userRouter;
//now, move to "app.ts"