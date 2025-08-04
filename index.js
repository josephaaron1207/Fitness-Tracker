const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); // Load environment variables

const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://fitness-tracker-frontend-rose.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); 

// MongoDB connection
mongoose.connect(process.env.MONGODB_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(' Now connected to MongoDB Atlas'))
    .catch(err => console.error(' MongoDB connection error:', err));

// Routes
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('🚀 Fitness Tracker API is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` API is now online on port ${PORT}`);
});

module.exports = { app, mongoose };
