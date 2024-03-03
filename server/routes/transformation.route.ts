//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createTransformation, editTransformation } from "../controllers/transformation.controller";

//20(c).transformation
const transformationRouter = express.Router();
transformationRouter.post("/create-transformation", isAuthenticated(), createTransformation);
transformationRouter.put('/edit-transformation/:id', isAuthenticated(), editTransformation);
export default transformationRouter;
//now, move to "app.ts"