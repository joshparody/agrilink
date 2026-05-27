// ═══════════════════════════════════════════════════════════════
// FILE:    agrilink-backend/config/db.js
// PURPOSE: Establishes the connection between your Node.js app
//          and your MongoDB Atlas cloud database
// USED BY: server.js calls connectDB() once when the app starts
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');

// ── MONGOOSE EVENT LISTENERS ─────────────────────────────────────────────────
// Mongoose fires these events as the connection state changes.
// Listening to them gives you real-time feedback in your terminal.
// These lines run once when the module is first loaded.

mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose: connection established');
});

mongoose.connection.on('error', (err) => {
  console.error(`🔴 Mongoose: connection error — ${err.message}`);
  // This fires if the connection drops AFTER initial setup
  // e.g. your internet cuts out while the server is running
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose: connection lost');
  // Fires when connection is cleanly closed (e.g. server shutdown)
});

// ── GRACEFUL SHUTDOWN ─────────────────────────────────────────────────────────
// When you press Ctrl+C in the terminal to stop the server,
// Node.js emits the 'SIGINT' signal.
// We listen for it and close the MongoDB connection cleanly
// instead of just killing the process abruptly.
// WHY this matters: abrupt disconnections can cause data corruption
// on writes that were in progress when the process died.

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔵 Mongoose: connection closed cleanly (app termination)');
    process.exit(0); // 0 = success exit code (normal shutdown)
  } catch (err) {
    console.error('Error during shutdown:', err.message);
    process.exit(1); // 1 = error exit code
  }
});

// ── MAIN CONNECT FUNCTION ─────────────────────────────────────────────────────

const connectDB = async () => {
  // async means this function returns a Promise.
  // await inside it means "pause here until this operation completes,
  // then continue" — without blocking the rest of Node.js.

  try {
    // mongoose.connect() does two things:
    //   1. Opens a TCP socket connection to your MongoDB Atlas cluster
    //   2. Authenticates using the credentials in your URI
    //
    // The URI format is:
    // mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME
    //   mongodb+srv:// = the protocol (like https:// for websites)
    //   USERNAME:PASSWORD = your Atlas database user credentials
    //   @cluster0.xxxxx.mongodb.net = the Atlas server address
    //   /agrilink = the specific database to use inside the cluster
    //
    // process.env.MONGODB_URI reads from your .env file.
    // dotenv (loaded in server.js before this file is required)
    // makes all .env values available as process.env properties.

    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // These options configure how Mongoose manages the connection pool.
      // A "connection pool" is a set of pre-opened connections kept ready
      // so your app doesn't need to open a new connection for every query.

      maxPoolSize: 10,
      // Keep up to 10 connections open simultaneously.
      // For a student project, 5–10 is more than enough.
      // Production apps might use 50–100.

      serverSelectionTimeoutMS: 5000,
      // If Atlas cannot be reached within 5 seconds, throw an error.
      // Without this, your app would hang silently waiting forever.

      socketTimeoutMS: 45000,
      // If a query takes longer than 45 seconds, assume it failed.
      // Prevents zombie queries from blocking your server indefinitely.
    });

    // connection.connection.host is the Atlas cluster hostname
    // Seeing this confirms you connected to the RIGHT database server
    console.log(`✅ MongoDB Atlas Connected Successfully`);
    console.log(`   Host: ${connection.connection.host}`);
    console.log(`   Database: ${connection.connection.name}`);

  } catch (error) {
    // Common errors and what they mean:
    //
    // MongoServerError: bad auth
    //   → Wrong username or password in your MONGODB_URI
    //   → Fix: Check your Atlas database user credentials
    //
    // MongoNetworkError: failed to connect
    //   → Your Atlas cluster IP whitelist is blocking you
    //   → Fix: Atlas dashboard → Network Access → Add IP → 0.0.0.0/0
    //
    // Error: querySrv ENOTFOUND
    //   → DNS cannot find the Atlas server — check your internet connection
    //   → Also happens if you copied the URI wrong
    //
    // Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
    //   → Your MONGODB_URI in .env is missing or malformed

    console.error('❌ MongoDB Atlas Connection Failed');
    console.error(`   Error: ${error.message}`);
    console.error('');
    console.error('TROUBLESHOOTING CHECKLIST:');
    console.error('  1. Is MONGODB_URI set in your .env file?');
    console.error('  2. Are your Atlas username and password correct?');
    console.error('  3. Is your IP address whitelisted on Atlas?');
    console.error('     → cloud.mongodb.com → Network Access → Add 0.0.0.0/0');
    console.error('  4. Is your internet connection active?');

    process.exit(1);
    // Crash the process intentionally.
    // A server without a database is useless and dangerous —
    // it would accept requests but silently fail to read/write data.
  }
};

module.exports = connectDB;