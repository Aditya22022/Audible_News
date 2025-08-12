// ========================================
// JWT AUTHENTICATION MIDDLEWARE
// ========================================

const jwt = require('jsonwebtoken');

// Middleware to verify JWT token in Authorization header
function authenticateToken(req, res, next) {
  
    const authHeader = req.headers['authorization'];//That header is expected in this format:Authorization: Bearer <token>
//So it splits the string and extracts just the token (<token>).
    const token = authHeader && authHeader.split(' ')[1];

    // If no token, deny access
    if (!token) {
        return res.status(401).json({ error: 'No token provided. Access denied.' });
    }

    // Verify the token with the help the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {//If successful, it returns the decoded user data in the "user" object.
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        // 
        // If the token is valid, it decodes the payload (the data you put inside the token when you created it).
//The decoded payload is passed as the user argument in the callback.Attach user info to request object for use in next middleware/route
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;