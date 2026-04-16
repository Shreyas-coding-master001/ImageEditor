const mongoose = require("mongoose");

async function connectDB(retries = 3) {
  const maxRetries = retries;
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("DataBase Connected successfully");
      return;
    } catch (err) {
      console.error(`DB connection attempt failed (retries left: ${retries - 1}):`, err.message);
      retries--;
      if (retries === 0) throw err;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
    }
  }
}

module.exports = connectDB;
