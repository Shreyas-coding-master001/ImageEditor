const express = require("express");
const multer = require("multer");
const authUser = require("../middleware/auth.middleware");
const imageRoute = express.Router();
const imageController = require("../controllers/image.controlloers");

//Multer Storage : 
const storage = multer.memoryStorage();
const upload = multer({ storage : storage });

/**
 * @route post /api/imageEdit/uploadImage
 * @description UPloads image in cloudary for getting url
 */
imageRoute.post("/uploadImage", authUser, upload.single("image"), imageController.imageControllerUploader);

/**
 * @route get /api/imageEdit/getAllImages
 */
imageRoute.get("/getAllImages", authUser, imageController.imageControllerGetAllImages);

module.exports = imageRoute;