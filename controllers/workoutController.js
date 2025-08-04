const Workout = require("../models/Workout");
const auth = require('../auth'); 
const { errorHandler } = auth;

// Helper to format workouts
const formatWorkout = (workout) => {
  if (!workout) return null;
  return {
    id: workout._id.toString(),
    name: workout.name,
    duration: workout.duration,
    dateAdded: workout.dateAdded,
    status: workout.status,
    userId: workout.userId.toString()
  };
};

// Add a new workout
module.exports.addWorkout = async (req, res) => {
  const { name, duration, status } = req.body;

  if (!name || !duration) {
    return res.status(400).send({ message: 'Workout name and duration are required.' });
  }

  try {
    let newWorkout = new Workout({
      name,
      duration,
      status: status || "Pending",
      userId: req.user.id
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).send({
      message: "Workout successfully added",
      workout: formatWorkout(savedWorkout)
    });
  } catch (error) {
    console.error("Error saving workout:", error);
    errorHandler(error, req, res);
  }
};

// Get workouts for logged-in user
module.exports.getMyWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id });
    const formatted = workouts.map(formatWorkout);
    return res.status(200).send(formatted);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    errorHandler(error, req, res);
  }
};

// Update a workout
module.exports.updateWorkout = async (req, res) => {
  const { name, duration, status } = req.body;
  const workoutId = req.params.id;

  if (!name || !duration || !status) {
    return res.status(400).send({ message: 'Workout name, duration, and status are required.' });
  }

  if (!['Completed', 'Pending'].includes(status)) {
    return res.status(400).send({ message: 'Invalid status. Must be Completed or Pending.' });
  }

  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId: req.user.id },
      { name, duration, status },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).send({ error: 'Workout not found or not authorized.' });
    }

    res.status(200).send({
      message: 'Workout updated successfully',
      updatedWorkout: formatWorkout(updatedWorkout)
    });
  } catch (error) {
    console.error("Error updating workout:", error);
    errorHandler(error, req, res);
  }
};

// Delete workout
module.exports.deleteWorkout = async (req, res) => {
  const workoutId = req.params.id;
  try {
    const deleted = await Workout.deleteOne({ _id: workoutId, userId: req.user.id });
    if (deleted.deletedCount < 1) {
      return res.status(404).send({ error: 'Workout not found or not authorized.' });
    }
    res.status(200).send({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error("Error deleting workout:", error);
    errorHandler(error, req, res);
  }
};

// Mark workout as Completed
module.exports.completeWorkoutStatus = async (req, res) => {
  const workoutId = req.params.id;
  try {
    const updatedWorkout = await Workout.findOneAndUpdate(
      { _id: workoutId, userId: req.user.id },
      { status: "Completed" },
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).send({ error: 'Workout not found or not authorized.' });
    }

    res.status(200).send({
      message: 'Workout marked as completed',
      updatedWorkout: formatWorkout(updatedWorkout)
    });
  } catch (error) {
    console.error("Error completing workout:", error);
    errorHandler(error, req, res);
  }
};
