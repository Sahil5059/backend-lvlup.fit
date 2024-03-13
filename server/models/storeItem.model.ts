//imports
import { Schema, model, Document } from "mongoose";

//22(a)store
interface IImage extends Document{
    public_id: string;
    url: string;
}
interface IStoreItem extends Document{
    title: string;
    originalPrice: number;
    reducedPrice: number;
    description: Array< string >;
    images: Array< IImage >;
    category: string;    
}
const imageSchema = new Schema< IImage >({
    public_id: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
})
const storeItemSchema = new Schema< IStoreItem >({
    title: {
        type: String,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    reducedPrice: {
        type: Number,
    },
    description: {
        type: [String],
        required: true,
    },
    images: {
        type: [imageSchema],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
});
const StoreItemLayout = model< IStoreItem >( 'StoreItem', storeItemSchema );
export default StoreItemLayout;
//now, move to "storeItem.controller.ts" in the "controllers" folder