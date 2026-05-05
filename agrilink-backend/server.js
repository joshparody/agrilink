// Force DNS to use Google's servers
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AgriLink API is running!',
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection with DNS override
mongoose.connect(process.env.MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log('MongoDB Connected successfully');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
    console.log('Health check: http://localhost:' + PORT + '/api/health');
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});