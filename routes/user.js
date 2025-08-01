// routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("./authMiddleware");

// Aligning with your fitnessApp.json endpoints
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", verifyToken, userController.getProfile); // Protected route

module.exports = router;