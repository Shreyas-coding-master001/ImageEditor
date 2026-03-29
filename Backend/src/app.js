/* In app.js :
Here Keep all the installing library and call the middlewares!!
*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.route");
const imageRoute = require("./routes/image.route");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

// important for cookies!!
app.use(cors({
    credentials: true,
    origin : "http://localhost:5173"
}));
app.use(cookieParser());

// All Routes here you can know where api's are 👍👍  
app.use("/api/auth", authRoute);
app.use("/api/imageEdit", imageRoute);

module.exports = app;