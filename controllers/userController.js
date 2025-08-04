const bcrypt = require('bcryptjs'); // Changed from 'bcrypt' to 'bcryptjs'
const User = require('../models/User');
const auth = require('../auth');

const { errorHandler } = auth;

module.exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, mobileNo, password } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName || !mobileNo) {
        return res.status(400).send({ message: 'All fields are required.' });
    }
    if (!email.includes("@")) {
        return res.status(400).send({ message: 'Email invalid' });
    }
    if (mobileNo.length !== 11) { // Assuming 11 digits for mobile number
        return res.status(400).send({ message: 'Mobile number invalid (must be 11 digits)' });
    }
    if (password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: 'Email already in use' });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            mobileNo,
            password: bcrypt.hashSync(password, 10) // Hash the password
        });

        await newUser.save();
        res.status(201).send({ message: 'Registered successfully' });
    } catch (error) {
        console.error("Error during user registration:", error);
        errorHandler(error, req, res); // Use the centralized error handler
    }
};

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required.' });
    }
    if (!email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'No email found' });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ message: 'Incorrect email or password' });
        }

        // Create and return JWT token
        const accessToken = auth.createAccessToken(user);
        res.status(200).send({
            message: 'User logged in successfully',
            access: accessToken, // Send the token as 'access' as per your frontend expectation
            userId: user._id.toString() // Also send the user ID for convenience
        });
    } catch (error) {
        console.error("Error during user login:", error);
        errorHandler(error, req, res);
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        // req.user.id is populated by the 'verify' middleware
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        // Remove password before sending to frontend
        const userProfile = user.toObject(); // Convert Mongoose document to plain object
        delete userProfile.password;
        return res.status(200).send(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        errorHandler(error, req, res);
    }
};
