//imports
import mongoose, { Schema, Document, Model } from "mongoose";

//20(a).transformation
interface ITransformationData extends Document{
    photo: {
        public_id: string;
        url: string;
    },
    title: string;
    description: string;
    name: string;
    profession: string;
}
const transformationSchema = new Schema<ITransformationData>({
    photo: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
});
const TransformationLayout:Model<ITransformationData> = mongoose.model("Transformation", transformationSchema);
export default TransformationLayout;
//now, move to "transformation.controller.ts" in the "controllers" folder