// config/db.js
// This file handles the connection between our Node.js app and MongoDB Atlas

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI reads the value from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // If connection succeeds, log the host name so we know it worked
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and exit the app
    // We exit because there's no point running without a database
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // 1 means "exit with failure"
  }
};

// Export so we can use this function in server.js
module.exports = connectDB;
