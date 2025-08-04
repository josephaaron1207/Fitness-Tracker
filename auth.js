const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "fallbackSecretKey"; // Use from .env

// Function to create a JWT access token
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id, // MongoDB's default ID
        email: user.email,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, JWT_SECRET_KEY, {});
};

// Middleware to verify JWT token
module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Failed", message: "No Token Provided" });
    }

    // Remove "Bearer " prefix
    token = token.slice(7, token.length);

    jwt.verify(token, JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(403).send({
                auth: "Failed",
                message: "Authentication Failed: " + err.message
            });
        } else {
            req.user = decodedToken; // Attach decoded user payload to request
            next(); // Proceed to the next middleware/route handler
        }
    });
};

// Middleware to verify if user is an admin (optional, but good practice)
module.exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden: Admin access required"
        });
    }
};

// Generic error handler middleware
module.exports.errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging

    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};

// Middleware to check if user is logged in (optional, verify already does this implicitly)
module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send({ message: "Unauthorized: Please log in." });
    }
};

// Add this console.log to see what is being exported from auth.js
console.log("Auth module exports:", module.exports); // NEW DEBUG LOG
