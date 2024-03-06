//imports
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { createStoreItem, deltedStoreItem, editStoreItem, sendOrderDetails } from "../controllers/storeItem.controller";

//22(c).store
const storeItemRouter = express.Router();
storeItemRouter.post( '/create-store-item', isAuthenticated(), createStoreItem );
storeItemRouter.put( '/edit-store-item/:id', isAuthenticated(), editStoreItem );
storeItemRouter.delete( '/delete-store-item/:id', isAuthenticated(), deltedStoreItem );
storeItemRouter.post( '/send-order-details', sendOrderDetails );
export default storeItemRouter;
//now, move to "app.ts"