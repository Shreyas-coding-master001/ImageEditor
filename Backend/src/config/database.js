const mongoose = require("mongoose");

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URI)
    .then(res => console.log("DataBase Connected"))
    .catch(err => console.log(err))
}

module.exports = connectDB;