// Import required packages
const express = require('express');// express is used to create a server
const cors = require('cors');// cors is used to allow requests from different origins
require('dotenv').config();// dotenv is used to load environment variables from a .env file
// Import database connection
const pool = require('./db');//db.js file loads and executes all the code inside it
const registerRoutes = require('./routes/register');// import the register routes from routes folder
const loginRoutes = require('./routes/login');// import the login routes from routes folder
const preferencesRoutes = require('./routes/preferences'); // import the preferences routes
const newsRoutes = require('./routes/news'); // import the news routes
const speechRoutes = require('./routes/speech');
// Create Express app
const app = express();

// Middleware setup
app.use(cors()); // Allow frontend to make requests
app.use(express.json()); //data is send in json format in requests and it is parsed into a javascript object using this middleware
// Connect register routes
app.use('/api/auth/register', registerRoutes);
// Connect login routes
app.use('/api/auth/login', loginRoutes);
app.use('/api/preferences', preferencesRoutes); // Mount preferences routes
app.use('/api/news', newsRoutes); // Mount news routes
app.use('/api/speech', speechRoutes);
// Basic route to test if server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is running successfully!' });
});

// Define port (use environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Test endpoint: http://localhost:${PORT}/api/test`);
});