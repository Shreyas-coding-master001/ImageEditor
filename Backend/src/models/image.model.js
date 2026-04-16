const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true, "User ID required"]
    },
    url : {
        type : String,
        required : [true, "Image URL required"]
    },
    public_id : {
        type : String,
        required : [true, "Cloudinary public_id required"]
    },
    public_url : {
        type : String,
        required : [true, "Public URL required"]
    },
    transformation : {
        type : String,
        default : ""
    }
}, { timestamps: true });


module.exports = mongoose.model("images", imageSchema);