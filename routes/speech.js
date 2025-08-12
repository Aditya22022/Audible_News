// ========================================
// TEXT-TO-SPEECH ROUTE
// ========================================

const express = require('express');
const authenticateToken = require('../authMiddleware');

const router = express.Router();

// ========================================
// POST /api/speech - Convert text to speech
// ========================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        //Destructures text, voice, and speed from the request body. and voice: 'female' if not provided
        const { text, voice = 'female', speed = 'normal' } = req.body;



        // Ensures that text is provided and not empty.
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Text is required' });
        }

        // For now, we'll return the text and speech settings
        // In a real implementation, you might use a TTS service like Google Cloud TTS
        // or integrate with browser's Web Speech API on the frontend
        res.json({
            status: 'success',
            message: 'Text-to-speech request received',
            data: {
                text: text,
                voice: voice,
                speed: speed,
                // In a full implementation, you'd return audio data or a URL
                audioUrl: null // Placeholder for actual audio
            }
        });

    } catch (error) {
        console.error('Speech error:', error);
        res.status(500).json({ error: 'Failed to process speech request' });
    }
});

module.exports = router;