// ========================================
// REGISTER ROUTE - User Registration Logic
// ========================================

// Import required packages from node_modules
const express = require('express');        // Web framework for creating API routes
const bcrypt = require('bcryptjs');       // For securely hashing passwords
const jwt = require('jsonwebtoken');      // For creating authentication tokens
const pool = require('../db');            // Database connection pool (goes up one folder to find db.js)

// Create an Express router to handle registration routes
const router = express.Router();

// ========================================
// POST /api/auth/register - Register New User
// ========================================
router.post('/', async (req, res) => {
    try {
        // STEP 1: Extract user data from request body
        // req.body contains the JSON data sent from frontend (email and password)
        const { email, password } = req.body;

        // STEP 2: Check if user already exists in database
        // We query the users table to see if this email is already registered
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',  // $1 is a parameter placeholder for security
            [email]                                  // Pass email as parameter to prevent SQL injection
        );

        // If user already exists, return error (don't allow duplicate emails)
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // STEP 3: Hash the password for security
        // Never store plain text passwords in database
        const saltRounds = 10;  // Number of salt rounds (higher = more secure but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // STEP 4: Insert new user into database
        // We insert the email and hashed password, then return the new user's id and email
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]  // Pass email and hashed password as parameters
        );

        // STEP 5: Generate JWT token for authentication
        // This token will be used to identify the user in future requests
        const token = jwt.sign(//token variable holds that long string (JWT) that gets generated.
            { 
                userId: newUser.rows[0].id,     // data wrapped inside token ....User's database ID
                email: newUser.rows[0].email    // User's email
            },
            process.env.JWT_SECRET,             // Secret key from .env file,used to verify token is also stored in the token itself
            { expiresIn: '24h' }               // Token expires in 24 hours
        );

        // STEP 6: Send success response back to frontend
        // Include token and user info (but NOT the password)
        res.status(201).json({
            message: 'User registered successfully',
            token: token,                       // JWT token for authentication
            user: {
                id: newUser.rows[0].id,         // User's database ID
                email: newUser.rows[0].email    // User's email
            }// secret key is not disclosed in the response
        });

    } catch (error) {
        // STEP 7: Handle any errors that occur during registration
        console.error('Registration error:', error);  // Log error for debugging
        res.status(500).json({ error: 'Server error' });  // Send generic error to frontend
    }
});

// Export the router so it can be used in other files
module.exports = router;