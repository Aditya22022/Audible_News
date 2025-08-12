// Import the PostgreSQL client
const { Pool } = require('pg');//A pool class allows multiple queries to run efficiently without manually opening/closing connections every time.

// Create a new connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the database connection
pool.connect((err, client, release) => {//trying to connect to the database
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Database connected successfully!');
        release(); // Release the client back to the pool
    }
});

// Export the pool so we can use it in other files
module.exports = pool;