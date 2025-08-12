// ========================================
// USER PREFERENCES ROUTES (Protected)
// ========================================

const express = require('express');
const pool = require('../db');
const authenticateToken = require('../authMiddleware'); // Import our JWT middleware

const router = express.Router();

// ========================================
// GET /api/preferences - Get current user's preferences
// ========================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        // req.user.userId comes from the JWT payload (set by the middleware)
        const userId = req.user.userId;

        // Query the user_preferences table for this user
        const result = await pool.query(
            'SELECT * FROM user_preferences WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Preferences not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ========================================
// PUT /api/preferences - Update current user's preferences
// ========================================
router.put('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { favorite_categories, reading_speed, voice_type, auto_play } = req.body;

        // Update the user_preferences table for this user
        const result = await pool.query(
            `UPDATE user_preferences
             SET favorite_categories = $1,
                 reading_speed = $2,
                 voice_type = $3,
                 auto_play = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $5   
             RETURNING *`,
            [favorite_categories, reading_speed, voice_type, auto_play, userId]
        );//WHERE user_id = $5 – Updates only the row where user_id matches the provided userId.
            //RETURNING * – Returns the updated row after the update.
       

        if (result.rows.length === 0) {//Checks if no rows were returned — meaning no user with that user_id exists.
            return res.status(404).json({ error: 'Preferences not found' });
        }

        res.json({
            message: 'Preferences updated successfully',
            preferences: result.rows[0]
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;