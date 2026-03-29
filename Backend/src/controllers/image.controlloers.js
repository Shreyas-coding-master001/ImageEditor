const cloudinary = require('cloudinary').v2;
const imageModel = require("../models/image.model");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // ✅ NOT "Projects"
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECREAT
});

/**
 * @folder my : CLOUD_NAME/Image_Editor
 * @param {Buffer of image} fileBuffer 
 * @Uploads Images to Cloudary
 */
const uploadToCLoud = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        //Actual Storing of Image
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

/**
 * @route post /api/image/uploadImage
 * @description Here there is logic for image uploading in CLoudary and 
 * @param { Buffer of Image} req.file 
 */
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

/**
 * @route get /api/imageEdit/getAllImages
 * @description Here there is logic for getting all images of a particular user
 * @param {user} req user Details fetched from auth middleware
 */
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

module.exports = { 
    imageControllerUploader,
    imageControllerGetAllImages
}