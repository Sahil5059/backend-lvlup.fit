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
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
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

//7(a).setting-up-user-login
userSchema.methods.SignAccessToken = function() {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '', {expiresIn: "5m"});
}
userSchema.methods.SignRefreshToken = function() {
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN || '', {expiresIn: "3d"});
}
//to create "ACCESS_TOKEN" & "REFRESH_TOKEN", go to this website: "https://www.lastpass.com/features/password-generator", genearte the respective passwords of length 50 and paste them in the ".env" file
//watch this to understand the concept of access and refresh tokens- 2:51:30 to 2:54:30 from: "https://youtu.be/kf6yyxMck8Y?si=BZgOvCFkBfUVCD5c"
//now, move to "user.controller.ts" in the "controllers" folder


const userModel:Model<IUser> = mongoose.model("User", userSchema);
export default userModel;
//now, move to "user.controller.ts" in the "controllers" folder