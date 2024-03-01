//imports
import { Schema, model, Document } from "mongoose";

//18(a).edit-contact-us-data
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //this const "emailRegexPattern" will be used to verfiy if the entered email is a valid email-pattern or not
interface IContactUsData extends Document{
    address: string;
    email: string;
    phoneNumber: number;
}
const contactUsData = new Schema<IContactUsData>({
    address: {
        type: String,
    },
    email: {
        type: String,
        validate: {
            validator: function(value:string){
                return emailRegexPattern.test(value);
            },
            message:"Please enter a valid email",
        },
        unique:true,
    },
    phoneNumber: {
        type: Number,
    },
});
const ContactUsLayout = model<IContactUsData>('contactUs', contactUsData);
export default ContactUsLayout;
//now, move to contactUs.controller.ts in the "controllers" folder