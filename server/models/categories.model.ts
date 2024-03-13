//imports
import { Schema, model, Document } from "mongoose";

//23(a).categories
interface Categories extends Document{
    categories: Array< string >;
}
const categoriesSchema = new Schema< Categories >({
    categories: {
        type: [String],
        required: true,
    },
});
const CategoryLayout = model< Categories >( 'Categories', categoriesSchema );
export default CategoryLayout;
//now, move to "category.controller.ts" in the "controllers" folder