const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();


const corsOptions = {
    origin: [
        "http://localhost:5173", 
        "https://fitness-tracker-frontend-rose.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_STRING)
    .then(() => console.log("Now connected to MongoDB Atlas"))
    .catch(err => console.error(" MongoDB connection error:", err));

// Routes
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Fitness Tracker API is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API is now online on port ${PORT}`);
});

module.exports = { app, mongoose };
