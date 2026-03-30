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
        const image = await imageModel.findOneAndReplace(id, { transformation }, { new : true });
        if(!image) return res.status(404).json({ message : "Image Not Found" });
        res.status(200).json({ message : "Image Updated Successfully", image });
    }catch(err){
        return res.status(500).json({ message : "Failed to Update Image", err });
    }
}

module.exports = { 
    imageControllerUploader,
    imageControllerGetAllImages,
    imageControllerUpdateImage
}
