const express = require("express");
const multer = require("multer");
const authUser = require("../middleware/auth.middleware");
const imageRoute = express.Router();
const imageController = require("../controllers/image.controllers.js");

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
 * @description Get all images of a Particular user
 */
imageRoute.get("/getAllImages", authUser, imageController.imageControllerGetAllImages);

/**
 * @route patch /api/imageEdit/images/:id
 * @description Updates an existing image with new transformation data
 */
imageRoute.patch("/images/:id", authUser, imageController.imageControllerUpdateImage);

module.exports = imageRoute;