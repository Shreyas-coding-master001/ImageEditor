const cloudinary = require('cloudinary').v2;
const imageModel = require("../models/image.model");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECREAT
});

const uploadToCLoud = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type : "image",
                folder  : "Image_Editor"
            },
            (err, result) => {
                if(err) reject(err);
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    })
}

async function imageControllerUploader(req, res){
    try{
        const _id = req.user._id;
        const imageCloud = await uploadToCLoud(req.file.buffer);
        const image = await imageModel.create({
            user : _id,
            url : imageCloud.secure_url,
            public_url : imageCloud.url, 
        });
        console.log(image);
        res.status(201).json({
            message : "Image Set Successfully",
            image
        })
    }catch(err){
        res.status(500).json({ 
            message : "Uploading Failed",
            err
         });
    }
}

async function imageControllerGetAllImages(req, res){
    const _id = req.user._id;
    try{
        const Allimages = await imageModel.find({ user : _id });
        if(Allimages.length === 0) return res.status(404).json({ message : "No Image Found" });
        res.status(200).json({ message : "All Images Fetched Successfully", Allimages });
    }catch(err){
        res.status(500).json({
            message : "Failed to Fetch Images",
            err
        });
    }
}

async function imageControllerUpdateImage(req, res){
    const { id } = req.params;
    try{
        const { transformation } = req.body;
        console.log(transformation);
        
        // ✅ Use findByIdAndUpdate instead, or pass { _id: id } as filter
        const image = await imageModel.findByIdAndUpdate(
            id, 
            { transformation }, 
            { new: true }
        );

        if(!image) return res.status(404).json({ message: "Image Not Found" });
        res.status(200).json({ message: "Image Updated Successfully", image });

    } catch(err){
        console.log(err);
        return res.status(500).json({ message: "Failed to Update Image", err });
    }
}

async function imageControllerDeleteImage(req, res) {
    try {
        const { id } = req.params;
        const image = await imageModel.findOne({ _id: id, user: req.user._id });
        if (!image) {
            return res.status(404).json({ message: "Image not found or access denied" });
        }

        // Delete from Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(image.public_url, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        console.log("Cloudinary delete result:", result);

        // Delete from DB
        await imageModel.findByIdAndDelete(id);

        res.json({ message: "Image deleted successfully from Cloudinary and DB" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
}

module.exports = { 
    imageControllerUploader,
    imageControllerGetAllImages,
    imageControllerUpdateImage,
    imageControllerDeleteImage
}
