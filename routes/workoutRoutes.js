const express = require("express");
const router = express.Router();

const workoutController = require("../controllers/workoutController"); // Ensure correct path
const { verify } = require("../auth");

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);
router.patch("/updateWorkout/:id", verify, workoutController.updateWorkout);
router.delete("/deleteWorkout/:id", verify, workoutController.deleteWorkout);
router.patch("/completeWorkoutStatus/:id", verify, workoutController.completeWorkoutStatus);

module.exports = router;
