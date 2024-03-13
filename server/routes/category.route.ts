//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { categories } from "../controllers/category.controller";

//23(c).categories
const categoryRouter = express.Router();
categoryRouter.post("/category", isAuthenticated(), categories); //for create-edit-delete
export default categoryRouter;
//now, move to "app.ts"