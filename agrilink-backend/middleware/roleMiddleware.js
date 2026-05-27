// FILE: agrilink-backend/middleware/roleMiddleware.js

// restrictTo returns a middleware function.
// Usage: router.post('/listings', protect, restrictTo('farmer'), createListing)
// This means: must be logged in AND must be a farmer.

const restrictTo = (...roles) => {
  // roles is an array: e.g. ['farmer', 'admin']
  return (req, res, next) => {
    // req.user was set by the protect middleware that runs before this
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. This action requires the role: ${roles.join(' or ')}. Your role is: ${req.user.role}.`,
      });
    }
    next();
  };
};

module.exports = { restrictTo };