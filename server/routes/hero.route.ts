//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { editHeroData, getHeroData } from "../controllers/hero.controller";

//16(c).edit-hero-data
const heroRouter = express.Router();
heroRouter.get('/get-hero', isAuthenticated(), getHeroData);
heroRouter.put('/edit-hero', isAuthenticated(), editHeroData);
export default heroRouter;
//now, move to app.ts