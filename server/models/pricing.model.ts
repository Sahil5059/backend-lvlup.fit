//imports
import { Schema, model, Document } from "mongoose";

//19(a).edit-pricing
interface IPricingStructure extends Document{
    basic: number;
    special: number;
    premium: number;
}
interface IPricingPlan extends Document{
    monthly: {
        originalPrice: IPricingStructure,
        reducedPrice?: IPricingStructure,
    },
    yearly: {
        originalPrice: IPricingStructure,
        reducedPrice?: IPricingStructure,
    },
}
const pricingData = new Schema<IPricingPlan>({
    monthly: {
        originalPrice: {
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
        reducedPrice: {
            basic: {
                type: Number,
            },
            special: {
                type: Number,
            },
            premium: {
                type: Number,
            },
        },
    },
    yearly: {
        originalPrice: {
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
        reducedPrice: {
            basic: {
                type: Number,
            },
            special: {
                type: Number,
            },
            premium: {
                type: Number,
            },
        },
    },
});
const PricingLayout = model<IPricingPlan>('pricing', pricingData);
export default PricingLayout;
//now, move to pricing.controller.ts in the "controllers" folder