//imports
import { Schema, model, Document } from "mongoose";

//21(a).sales-banner
interface ISalesBanner extends Document{
    title: string;
    description: string;
}
const salesBannerSchema = new Schema< ISalesBanner >({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});
const SalesBannerLayout = model< ISalesBanner >( 'SalesBanner', salesBannerSchema );
export default SalesBannerLayout;
//now, move to "salesBanner.controller.ts" in the "controllers" folder