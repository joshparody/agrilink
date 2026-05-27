// FILE: agrilink-backend/controllers/authController.js
const User = require('../models/User');
// FIX: Destructure generateToken to resolve the "generateToken is not a function" error
const { generateToken } = require('../utils/generateToken');

// ── REGISTER ──────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, role, location, farmDetails, supplierDetails } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'An account with this email already exists. Please log in instead.',
      });
    }

    // Create the user document.
    // The pre-save hook in User.js will hash the password automatically before saving.
    const newUser = await User.create({
      fullName,
      email,
      password,
      phone,
      role: role || 'buyer',
      location,
      farmDetails,
      supplierDetails,
    });

    // Generate a JWT token for the new user
    const token = generateToken(newUser._id, newUser.role);

    // Update lastLogin timestamp
    newUser.lastLogin = Date.now();
    await newUser.save({ validateBeforeSave: false });
    // validateBeforeSave: false skips re-running all validations
    // (password hashing hook only fires when password is modified — safe here)

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully.',
      token,
      data: { user: newUser },
      // newUser's toJSON() method (defined in User model) automatically
      // removes password, resetPasswordToken, resetPasswordExpires from the output
    });

  } catch (err) {
    next(err); // Passes to global error handler in server.js
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate that both fields were sent
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password.',
      });
    }

    // Find user by email and explicitly pull the password and active status fields
    const user = await User.findOne({ email }).select('+password +isActive');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.',
        // SECURITY: Never say "email not found" — that tells attackers which emails are registered
      });
    }

    // Use the comparePassword instance method from User.js
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password.',
      });
    }

    // Check user suspension status safely
    if (user.isActive === false) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been suspended. Please contact support.',
      });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully.',
      token,
      data: { user },
    });

  } catch (err) {
    next(err);
  }
};

// ── GET CURRENT USER (protected route) ───────────────────────────────────────
// GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    // We already have the user from the middleware — no second DB call needed
    res.status(200).json({
      status: 'success',
      data: { user: req.user },
    });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
// PATCH /api/v1/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    // Only allow safe fields to be updated here (not password, not role)
    const allowedFields = ['fullName', 'phone', 'location', 'farmDetails', 'supplierDetails', 'profileImage'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,            // return the UPDATED document, not the old one
        runValidators: true,  // run schema validators on the updated fields
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully.',
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

// ── CHANGE PASSWORD ────────────────────────────────────────────────────────────
// PATCH /api/v1/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both current password and new password.',
      });
    }

    // Fetch user WITH password (it's excluded by default in our schema's toJSON)
    const user = await User.findById(req.user._id).select('+password');

    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is incorrect.',
      });
    }

    // Assign new password — the pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully.',
      token,
      // Issue a new token because the old one should be invalidated conceptually
    });
  } catch (err) {
    next(err);
  }
};

{ 
}