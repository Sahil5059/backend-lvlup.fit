//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createSalesBanner, deleteSalesBanner, editSalesBanner } from "../controllers/salasBanner.controller";

//21(c).sales-banner
const salesBannerRouter = express.Router();
salesBannerRouter.post('/create-sales-banner', isAuthenticated(), createSalesBanner);
salesBannerRouter.put('/edit-sales-banner/:id', isAuthenticated(), editSalesBanner);
salesBannerRouter.delete('/delete-sales-banner/:id', isAuthenticated(), deleteSalesBanner);
export default salesBannerRouter;