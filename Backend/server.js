//Here all configs and Start the server
const app = require("./src/app");
const connectDB = require("./src/config/database");
const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server has started at port : ${port}`));
  } catch (err) {
    console.error('Failed to connect to DB and start server:', err);
    process.exit(1);
  }
})();
