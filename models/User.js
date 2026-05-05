// models/User.js
// Every person who uses AgriLink — farmers, buyers, suppliers, admins

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes accidental spaces at start/end
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two users can share an email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // NEVER return password in queries by default
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'supplier', 'admin'], // only these 4 values allowed
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      county: { type: String }, // e.g. "Nakuru"
      town: { type: String },   // e.g. "Naivasha"
    },
    profileImage: {
      type: String, // will store Cloudinary URL
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false, // admin can verify farmers/suppliers
    },
    isActive: {
      type: Boolean,
      default: true, // admin can deactivate accounts
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt fields
  }
);

// This runs BEFORE saving a user — hashes the password automatically
UserSchema.pre('save', async function (next) {
  // Only hash if password was changed (not on profile updates)
  if (!this.isModified('password')) return next();
  
  // Salt rounds = 10 means bcrypt runs the hash 2^10 = 1024 times
  // More rounds = more secure but slower. 10 is the industry standard
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password at login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
