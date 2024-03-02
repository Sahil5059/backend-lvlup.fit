//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { editPricing } from "../controllers/pricing.controller";

//19(c).edit-pricing
const pricingRouter = express.Router();
pricingRouter.put('/edit-pricing', isAuthenticated(), editPricing);
export default pricingRouter;
//now, move to "app.ts"