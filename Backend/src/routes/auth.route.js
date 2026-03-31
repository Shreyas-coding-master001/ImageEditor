const express = require("express");
const authController = require("../controllers/auth.Controller");
const authMiddleware = require("../middleware/auth.middleware");
const authRoute = express.Router();

/**
 * @route Post /api/auth/register
 * @description This Route creates a password hash and save the user in mongoDB 😎😎
 */
authRoute.post("/register", authController.AuthControllerRegister);

authRoute.post("/login", authController.AuthControllerLogin);

/**
 * @route GET /api/auth/me
 * @description Get current logged in user
 */
authRoute.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = authRoute;
