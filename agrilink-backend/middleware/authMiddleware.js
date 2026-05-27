// FILE: agrilink-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: "Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    // Split "Bearer TOKEN" on the space. Index [1] is the token itself.
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in. Please log in to access this resource.',
    });
  }

  try {
    // jwt.verify() checks the signature AND checks if the token has expired.
    // If valid, it returns the decoded payload: { id: '...', role: '...', iat: ..., exp: ... }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB to confirm the account still exists and is active.
    // We call select('-password') to explicitly exclude the password hash from the result.
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The account belonging to this token no longer exists.',
      });
    }

    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Attach the user to the request object.
    // Now any route handler that comes after this middleware can access req.user
    req.user = currentUser;
    next();

  } catch (err) {
    // jwt.verify() throws JsonWebTokenError or TokenExpiredError
    // These are handled by the global error handler in server.js
    next(err);
  }
};

module.exports = { protect };
