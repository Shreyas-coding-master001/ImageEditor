const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true, "UserID Required, So don,t Receive the ObjectID"]
    },
    url : {
        type : String,
        required : [true, "URL of Image was not Found"]
    },
    public_url : {
        type : String,
        required : [true, "Public id to delete and update dynamically"]
    },
    transformation : {
        type : String,
        default : ""
    }
});


module.exports = mongoose.model("images", imageSchema);