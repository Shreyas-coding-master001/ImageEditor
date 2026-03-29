const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : [true, "Username is required"]
    },
    email : {
        type : String,
        unique : true,
        required : [true, "email Required"]
    },
    password : {
        type : String,
        required : [true, "password is required"]
    },
    description : {
        type : String,
        default : ""
    }
});


module.exports = mongoose.model("users", userSchema);
