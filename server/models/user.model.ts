//imports
require('dotenv').config();
import mongoose, {Document,Model,Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

//5(a).setting-up-user-model
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //this const "emailRegexPattern" will be used to verfiy if the entered email is a valid email-pattern or not
export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    comparePassword: (password:string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}
const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please enter your name"],
    },
    email:{
        type:String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function(value:string){
                return emailRegexPattern.test(value);
            },
            message:"Please enter a valid email",
        },
        unique:true,
    },
    password:{
        type:String,
        minlength: [6, "Password must be at least 6 charcters"],
        select: false,
        required: [true, "Please enter your password"],
    },
}, {timestamps:true});
//setting up "hashing of password"
userSchema.pre<IUser>('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
//now we will compare the password entered by the user with the hashed user password stored in our database
userSchema.methods.comparePassword = async function(enteredPassword:string):Promise<boolean>{
    return await bcrypt.compare(enteredPassword, this.password);
};
const userModel:Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
//now, move to "user.controller.ts" in the "controllers" folder