//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { editContactUs } from "../controllers/contactUs.controller";

//18(b).edit-contact-us-data
const contactUsRouter = express.Router();
contactUsRouter.put('/edit-contact-us', isAuthenticated(), editContactUs);
export default contactUsRouter;
//now, move to "app.ts"