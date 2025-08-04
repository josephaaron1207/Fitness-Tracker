const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String, // Keeping as String as per your previous frontend, e.g., "30 mins"
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Pending" // Changed default to "Pending" for consistency
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Workout", workoutSchema);
