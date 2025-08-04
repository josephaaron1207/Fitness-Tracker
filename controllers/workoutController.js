const Workout = require("../models/Workout");
const auth = require('../auth'); // Adjust path if needed

const { errorHandler } = auth; // Destructure errorHandler

// Helper to format workout objects for consistent frontend consumption
const formatWorkout = (workout) => {
    if (!workout) return null;
    return {
        id: workout._id.toString(), // Map MongoDB _id to 'id'
        name: workout.name,
        duration: workout.duration,
        dateAdded: workout.dateAdded,
        status: workout.status,
        userId: workout.userId.toString()
    };
};

module.exports.addWorkout = async (req, res) => {
    const { name, duration, status } = req.body; // status is now expected from frontend

    if (!name || !duration) {
        return res.status(400).send({ message: 'Workout name and duration are required.' });
    }

    try {
        let newWorkout = new Workout({
            name: name,
            duration: duration,
            status: status || "Pending", // Use provided status or default to "Pending"
            userId: req.user.id // userId from authenticated user
        });

        const savedWorkout = await newWorkout.save();
        res.status(201).send({
            message: "Workout successfully added",
            workout: formatWorkout(savedWorkout) // Format the saved workout
        });
    } catch (error) {
        console.error("Error in saving the workout:", error);
        errorHandler(error, req, res);
    }
};

module.exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id });
        const formattedWorkouts = workouts.map(formatWorkout); // Format all workouts

        if (formattedWorkouts.length > 0) {
            return res.status(200).send(formattedWorkouts); // Send array directly
        } else {
            return res.status(200).send([]); // Send empty array if no workouts found
        }
    } catch (error) {
        console.error("Error finding workouts:", error);
        errorHandler(error, req, res);
    }
};

module.exports.updateWorkout = async (req, res) => {
    const { name, duration, status } = req.body;
    const workoutId = req.params.id;

    if (!name || !duration || !status) {
        return res.status(400).send({ message: 'Workout name, duration, and status are required for update.' });
    }

    try {
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id }, // Find by workout ID and user ID
            { name, duration, status },
            { new: true } // Return the updated document
        );

        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found or not authorized.' });
        }
        res.status(200).send({
            message: 'Workout updated successfully',
            updatedWorkout: formatWorkout(updatedWorkout) // Format the updated workout
        });
    } catch (error) {
        console.error("Error in updating a workout:", error);
        if (error.name === 'CastError' && error.path === '_id') {
            return res.status(400).send({ error: 'Invalid Workout ID format.' });
        }
        errorHandler(error, req, res);
    }
};

module.exports.deleteWorkout = async (req, res) => {
    const workoutId = req.params.id;

    try {
        const deletedResult = await Workout.deleteOne({ _id: workoutId, userId: req.user.id });

        if (deletedResult.deletedCount < 1) {
            return res.status(404).send({ error: 'Workout not found or not authorized to delete.' });
        }
        res.status(200).send({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error("Error in deleting a workout:", error);
        if (error.name === 'CastError' && error.path === '_id') {
            return res.status(400).send({ error: 'Invalid Workout ID format.' });
        }
        errorHandler(error, req, res);
    }
};

module.exports.completeWorkoutStatus = async (req, res) => {
    const workoutId = req.params.id;

    try {
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id },
            { status: "Completed" }, // Set status to "Completed"
            { new: true }
        );

        if (!updatedWorkout) {
            return res.status(404).send({ error: 'Workout not found or not authorized.' });
        }
        res.status(200).send({
            message: 'Workout marked as completed',
            updatedWorkout: formatWorkout(updatedWorkout) // Format the updated workout
        });
    } catch (error) {
        console.error("Error completing workout:", error);
        if (error.name === 'CastError' && error.path === '_id') {
            return res.status(400).send({ error: 'Invalid Workout ID format.' });
        }
        errorHandler(error, req, res);
    }
};
