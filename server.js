// server.js

// Import required modules
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// need to load the env before the routes
const routes = require('./api/routes/routes.js');

// Set up multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Store the file in memory as a buffer

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Basic error handling for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error occurred.' });
});

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Express server is running at http://localhost:${port}`);
});