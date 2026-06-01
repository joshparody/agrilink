// ── STEP 1: INITIAL CONFIGURATION ────────────────────────────────────────────
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Load environment variables BEFORE any other logic
dotenv.config();

// Debug check for the connection string
console.log('DEBUG: URI is:', process.env.MONGODB_URI ? 'Defined ✅' : 'Undefined ❌');

// ── STEP 2: DATABASE CONNECTION ──────────────────────────────────────────────
connectDB();

// ── STEP 3: APP INITIALIZATION & SECURITY ────────────────────────────────────
const app = express();

// Security Headers
app.use(helmet());

// NoSQL Injection Protection
app.use(mongoSanitize());

// Request Logging (Development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── STEP 4: RATE LIMITING ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    status: 'error',
    message: 'Too many requests from this IP address. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.set('authLimiter', authLimiter);

// ── STEP 5: CORS & BODY PARSING ──────────────────────────────────────────────
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'https://agrilink.vercel.app'].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── STEP 6: STATIC FILES & TIMESTAMPS ────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ── STEP 7: ROUTES ───────────────────────────────────────────────────────────
// Base Auth Route
app.use('/api/v1/auth', require('./routes/authRoutes'));

// 🚨 INTEGRATED CORE AGRI-LINK PORTAL ROUTES
app.use('/api/v1/produce', require('./routes/produce.routes.js'));
app.use('/api/v1/orders', require('./routes/order.routes.js'));
app.use('/api/v1/supplies', require('./routes/supply.routes.js'));

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AgriLink API is running',
    data: {
      timestamp: req.requestTime,
      environment: process.env.NODE_ENV,
      uptime: `${Math.floor(process.uptime())}s`,
    },
  });
});

// ── STEP 8: ERROR HANDLING ───────────────────────────────────────────────────
// 404 Handler (Triggers if incoming URL matches none of the step 7 routes)
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ── STEP 9: START SERVER ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('══════════════════════════════════════════════');
  console.log(' 🌱 AgriLink API Server Started');
  console.log('══════════════════════════════════════════════');
  console.log(`  Environment : ${process.env.NODE_ENV}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  Health      : http://localhost:${PORT}/api/v1/health`);
  console.log('══════════════════════════════════════════════');
});

// ── STEP 10: SAFETY NETS ─────────────────────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('🔴 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => process.exit(1));  
});