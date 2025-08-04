const express = require('express');
const userController = require('../controllers/userController');
const { verify, isLoggedIn } = require("../auth");

const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

// Add this console.log to check the value of userController.getProfile
console.log("Value of userController.getProfile:", userController.getProfile);
// Add this console.log to check the value of verify
console.log("Value of verify:", verify); // This is the new log

router.get("/details", verify, userController.getProfile); // This is line 14

module.exports = router;
