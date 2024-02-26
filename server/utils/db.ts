//imports
import mongoose from "mongoose";
require('dotenv').config();

//3(a).connecting-to-our-database
//first, watch- 1:13:30 to 1:19:05 on "https://youtu.be/kf6yyxMck8Y?si=AUYxm7biG1di4EKK"
const dbUrl:string = process.env.DB_URL || '';
const connectDB = async() => {
    try {
        await mongoose.connect(dbUrl).then((data:any) => {console.log(`Database connected with ${data.connection.host}`)});
    } catch (error:any) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
}
export default connectDB;
//now, move to "server.ts"