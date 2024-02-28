//imports
import {app} from './app';
require("dotenv").config();
import connectDB from './utils/db';
import {v2 as cloudinary} from "cloudinary";

//14(b).update-user-avatar
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
//now, move to "user.route.ts" in the "routes" folder

//1(b).creating-server
//create a ".env" file in root-directory and write "PORT = 8000" and then come back here
app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);

    //3(b).connecting-to-our-database
    connectDB();
    //now move to "ErroHandler.ts" inside the "utils" folder

});
//now add the following line in the "scripts" section of "package.json" before hitting "npm run dev": ""dev": "ts-node-dev --respawn --transpile-only server.ts"".
//now move to app.ts