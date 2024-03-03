//imports
import { Schema, model, Document } from "mongoose";

//19(a).edit-pricing
interface IPricingStructure extends Document{
    basic: number;
    special: number;
    premium: number;
}
interface IPricingPlan extends Document{
    monthly: IPricingStructure,
    yearly: IPricingStructure,
}
const pricingData = new Schema<IPricingPlan>({
    monthly: {
        basic: {
            type: Number,
            required: true
        },
        special: {
            type: Number,
            required: true
        },
        premium: {
            type: Number,
            required: true
        },
    },
    yearly: {
        basic: {
            type: Number,
            required: true
        },
        special: {
            type: Number,
            required: true
        },
        premium: {
            type: Number,
            required: true
        },
    },
});
const PricingLayout = model<IPricingPlan>('pricing', pricingData);
export default PricingLayout;
//now, move to pricing.controller.ts in the "controllers" folder