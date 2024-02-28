//imports
import express from "express";
import { getUserInfo, loginUser, logoutUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo } from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

//7(e).setting-up-user-login
const userRouter = express.Router();
userRouter.post('/login', loginUser);

//8(c).setting-up-user-logout
userRouter.get('/logout', isAuthenticated, logoutUser);
//now, move to "user.contoller.ts" in the "controllers" folder

//9(b).setting-up-code-to-update-access_token
userRouter.get('/refresh', updateAccessToken);
//now, move to "user.service.ts" inside the "services" folder

//10(c).setting-up-code-to-get-user-info
userRouter.get("/me", isAuthenticated, getUserInfo);
//now, move to "user.contoller.ts" in the "controllers" folder

//11(b).setting-up-social-auth
userRouter.post("/social-auth", socialAuth);
//now, move to "user.contoller.ts" in the "controllers" folder

//12(b).update-user-info
userRouter.put('/update-user-info', isAuthenticated, updateUserInfo);
//now, move to "user.contoller.ts" in the "controllers" folder

//13(b).update-user-password
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
//now, move to "user.contoller.ts" in the "controllers" folder

//14(c).update-user-avatar
userRouter.put('/update-user-avatar', isAuthenticated, updateProfilePicture);
//

export default userRouter;
//now, move to "app.ts"