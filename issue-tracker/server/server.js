// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes and middleware
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issues'); // Assuming this is your existing issues route
const auth = require('./middleware/auth');

// Create Express server
const app = express();

// Connect to database
connectDB(); // Using your existing connection setup

// Middleware
app.use(cors({
  origin: true, // You might want to specify your frontend URL here
  credentials: true // Required for cookies/sessions
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser for JWT tokens

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/issues', auth, issueRoutes); // Protect issue routes with auth middleware

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Issue Tracker API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});