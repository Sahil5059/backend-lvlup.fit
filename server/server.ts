//imports
import {app} from './app';
require("dotenv").config(); //create a ".env" file in root-directory and write "PORT = 8000" and then come back here

//2.creating-server
app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
}); //now add the following line in the "scripts" section of "package.json" before hitting "npm run dev": ""dev": "ts-node-dev --respawn --transpile-only server.ts"". Now move to app.ts