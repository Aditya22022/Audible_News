// ========================================
// LOGIN ROUTE - User Authentication Logic
// ========================================

// Import required packages from node_modules
const express = require('express');        // Web framework for creating API routes
const bcrypt = require('bcryptjs');       // For comparing hashed passwords
const jwt = require('jsonwebtoken');      // For creating authentication tokens
const pool = require('../db');            // Database connection pool

// Create an Express router to handle login routes
const router = express.Router();

// ========================================
// POST /api/auth/login - Authenticate User
// ========================================
router.post('/', async (req, res) => {
    try {
        // STEP 1: Extract user credentials from request body
        // req.body contains the JSON data sent from frontend (email and password)
        const { email, password } = req.body;

        // STEP 2: Find user by email in database
        // We query the users table to find a user with this email
        const user = await pool.query(
            'SELECT * FROM users WHERE email = $1',  // $1 is a parameter placeholder for security
            [email]                                  // Pass email as parameter to prevent SQL injection
        );

        // STEP 3: Check if user exists
        // If no user found with this email, return error
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // STEP 4: Verify password
        // Compare the provided password with the hashed password in database
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        // If password doesn't match, return error (don't reveal which credential is wrong)
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // STEP 5: Generate JWT token for successful login
        // This token will be used to identify the user in future requests
        const token = jwt.sign(//token variable holds that long string (JWT) that gets generated.
            { 
                userId: user.rows[0].id,       // data wrapped inside token ....User's database ID
                email: user.rows[0].email      // User's email
            },
            process.env.JWT_SECRET,            // Secret key from .env file,used to verify token is also stored in the token itself
            { expiresIn: '24h' }              // Token expires in 24 hours
        );


       /* ✅ How tokens work to prevent baar barr writing emails and passwords to log in:
        User logs in → server checks email/password.
        
        If valid, server generates a token (e.g. JWT) containing user info.
        
        Token (a long string)is signed using a secret key that only the server knows.
        
        The token is sent to the client (browser/app).
        
        On later requests, client sends this token instead of email/password.
        
        Server verifies the token by checking the signature using the secret key.*/


        // STEP 6: Send success response back to frontend
        // Include token and user info (but NOT the password)
        res.json({
            message: 'Login successful',
            token: token,                      // JWT token for authentication(long string)
            user: {
                id: user.rows[0].id,          // User's database ID
                email: user.rows[0].email     // User's email
            }
        });

    } catch (error) {
        // STEP 7: Handle any errors that occur during login
        console.error('Login error:', error);  // Log error for debugging
        res.status(500).json({ error: 'Server error' });  // Send generic error to frontend
    }
});

// Export the router so it can be used in other files
module.exports = router;