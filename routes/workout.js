// routes/workout.js
const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const { verifyToken } = require("./authMiddleware");

// Aligning with your fitnessApp.json endpoints
router.post("/addWorkout", verifyToken, workoutController.addWorkout);
router.get("/getMyWorkouts", verifyToken, workoutController.getMyWorkouts);
router.put("/updateWorkout/:id", verifyToken, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id", verifyToken, workoutController.deleteWorkout);
router.put("/completeWorkoutStatus/:id", verifyToken, workoutController.completeWorkoutStatus);

module.exports = router;