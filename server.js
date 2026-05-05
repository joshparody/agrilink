// server.js
// The entry point of your entire backend application

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file FIRST
// This must come before anything that uses process.env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware — code that runs on every single request
app.use(cors());                        // allows frontend to call this backend
app.use(express.json());                // parses incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // parses form data

// Test route — visit http://localhost:5000/api/health to confirm server works
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🌱 AgriLink API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Define the port — use .env value or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});