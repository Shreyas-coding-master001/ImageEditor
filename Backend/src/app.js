/* IN app.js :
Here Keep all the installing library and call the middlewares!!
*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

module.exports = app;