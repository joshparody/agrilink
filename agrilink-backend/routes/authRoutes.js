const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Dynamic wrapper middleware to safely fetch and execute the auth limiter from app settings
const dynamicAuthLimiter = (req, res, next) => {
  const limiter = req.app.get('authLimiter');
  
  if (limiter) {
    return limiter(req, res, next);
  }
  
  // Fallback: If the limiter wasn't set in server.js, don't crash, just proceed
  console.warn('⚠️ WARNING: authLimiter is not defined on app settings. Skipping rate limit.');
  next();
};

// Public routes (no token required)
router.post('/register', dynamicAuthLimiter, register);
router.post('/login',    dynamicAuthLimiter, login);

// Protected routes (token required — protect middleware runs first)
router.get('/me',                protect, getMe);
router.patch('/update-profile',  protect, updateProfile);
router.patch('/change-password', protect, changePassword);

module.exports = router;