// controllers/workoutController.js
const Workout = require("../models/workout");

// Add a new workout
module.exports.addWorkout = async (req, res) => {
  try {
    const { name, duration } = req.body;
    const userId = req.user.userId; // Get user ID from the token

    // Check if userId is present from the token
    if (!userId) {
        return res.status(401).json({ message: "Authentication failed. User ID not found in token." });
    }

    const newWorkout = new Workout({
      name,
      duration,
      userId,
    });

    await newWorkout.save();
    res.status(201).json({ message: "Workout added successfully", workout: newWorkout });
  } catch (error) {
    // Log the full error to the console for debugging
    console.error("Error creating workout:", error);

    // Send a more detailed error message to the client
    res.status(500).json({
      message: "Error adding workout",
      details: error.message, // Send the specific error message from Mongoose or other sources
      // You can also add more details from the error object if needed
      // fullError: error
    });
  }
};

// Get all workouts for the authenticated user
module.exports.getMyWorkouts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const workouts = await Workout.find({ userId });

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving workouts", error });
  }
};

// Update a workout
module.exports.updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration } = req.body;
    const userId = req.user.userId;

    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId }, // Ensure the workout belongs to the user
      { name, duration },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found or you don't have permission" });
    }

    res.status(200).json({ message: "Workout updated successfully", workout: updatedWorkout });
  } catch (error) {
    res.status(500).json({ message: "Error updating workout", error });
  }
};

// Delete a workout
module.exports.deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedWorkout = await Workout.findOneAndDelete({ _id: id, userId });

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found or you don't have permission" });
    }

    res.status(200).json({ message: "Workout deleted successfully", workout: deletedWorkout });
  } catch (error) {
    res.status(500).json({ message: "Error deleting workout", error });
  }
};

// Update workout status to 'completed'
module.exports.completeWorkoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const completedWorkout = await Workout.findOneAndUpdate(
      { _id: id, userId },
      { status: "completed" },
      { new: true }
    );

    if (!completedWorkout) {
      return res.status(404).json({ message: "Workout not found or you don't have permission" });
    }

    res.status(200).json({ message: "Workout status updated to completed", workout: completedWorkout });
  } catch (error) {
    res.status(500).json({ message: "Error updating workout status", error });
  }
};