//Here all configs and Start the server
const app = require("./src/app");
const connectDB = require("./src/config/database");
const port = process.env.Port || 3000;

connectDB();

app.listen(port, () => console.log(`Server has started at port : ${port}`));