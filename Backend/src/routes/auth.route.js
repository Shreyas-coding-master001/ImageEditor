const express = require("express");
const authController = require("../controllers/auth.Controller");
const authRoute = express.Router();

/**
 * @route Post /api/auth/register
 * @description This Route creates a password hash and save the user in mongoDB 😎😎
 */
authRoute.post("/register", authController.AuthControllerRegister);

authRoute.post("/login", authController.AuthControllerLogin)

module.exports = authRoute;