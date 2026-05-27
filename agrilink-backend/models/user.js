// FILE: agrilink-backend/models/User.js
// PURPOSE: Blueprint for every person who registers on AgriLink
// RELATIONSHIPS: Referenced by Product, Order, Message, SupplierProduct, InputRequest

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // ════════════════════════════════════════════════
    // SECTION 1 — IDENTITY
    // ════════════════════════════════════════════════

    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      // trim: true removes accidental leading/trailing spaces
      // "  John Kamau  " gets saved as "John Kamau"
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      // unique: true creates a database-level constraint
      // If two users try to register with the same email,
      // MongoDB throws a duplicate key error (error code 11000)
      lowercase: true,
      // Stores everything in lowercase — "JOHN@Gmail.COM" → "john@gmail.com"
      // This prevents the same email appearing as two different accounts
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      // match: checks the value against a Regular Expression pattern
      // This regex accepts: "farmer@gmail.com", "john.doe@company.co.ke"
      // It rejects: "notanemail", "missing@", "@nodomain"
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // IMPORTANT: We will NEVER save the raw password the user types.
      // The pre-save hook (defined below) intercepts the save and
      // replaces this field with a bcrypt hash before it reaches MongoDB.
      // What gets stored: "$2a$12$K9uJ8mNxL2...randomhash...Kp3"
    },

    phone: {
      type: String,
      trim: true,
      match: [
        /^(\+254|0)[17]\d{8}$/,
        'Please provide a valid Kenyan phone number e.g. 0712345678',
      ],
      // Kenyan numbers: start with +254 or 0, then 7 or 1, then 8 digits
      // Accepts: "0712345678", "+254712345678"
      // Rejects: "123", "0800ABC123", "07123"
    },

    // ════════════════════════════════════════════════
    // SECTION 2 — ROLE (controls all permissions)
    // ════════════════════════════════════════════════

    role: {
      type: String,
      enum: {
        values: ['farmer', 'buyer', 'supplier', 'admin'],
        message: '"{VALUE}" is not valid. Role must be: farmer, buyer, supplier, or admin',
      },
      // enum is one of the most powerful validators in Mongoose.
      // It restricts the allowed values to EXACTLY this list.
      // Without enum, someone could POST role: "superuser" and bypass security.
      // With enum, Mongoose throws a validation error before MongoDB ever sees it.
      default: 'buyer',
      // Most people visiting AgriLink are buyers browsing produce.
      // If someone registers without selecting a role, they become a buyer.
    },

    // ════════════════════════════════════════════════
    // SECTION 3 — PROFILE
    // ════════════════════════════════════════════════

    profileImage: {
      type: String,
      default: '',
      // Stores a Cloudinary URL after upload.
      // Example: "https://res.cloudinary.com/agrilink/image/upload/v1234/profile_abc.jpg"
      // Empty string means no photo uploaded yet — handled with a default avatar in UI.
    },

    location: {
      county: {
        type: String,
        trim: true,
        // e.g. "Nakuru", "Kiambu", "Meru", "Nairobi"
        // Used for filtering: "Show me farmers near Nakuru"
      },
      town: {
        type: String,
        trim: true,
        // e.g. "Naivasha", "Thika", "Meru Town", "Westlands"
      },
      coordinates: {
        // Optional GPS data — for future map features
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    // ════════════════════════════════════════════════
    // SECTION 4 — FARMER-SPECIFIC DATA
    // Only populated when role === 'farmer'
    // For buyers and suppliers these remain at their defaults
    // ════════════════════════════════════════════════

    farmDetails: {
      farmName: {
        type: String,
        trim: true,
        // e.g. "Kamau Family Farm", "Green Valley Organics"
      },
      farmSize: {
        type: String,
        trim: true,
        // Stored as a string to accommodate different formats:
        // "2 acres", "0.5 hectares", "small plot"
      },
      primaryCrops: [{ type: String }],
      // Array of strings — a farmer can grow multiple crops
      // MongoDB stores this as: ["Tomatoes", "Maize", "Beans"]
      // In your UI, this becomes a multi-select checklist during registration
    },

    // ════════════════════════════════════════════════
    // SECTION 5 — SUPPLIER-SPECIFIC DATA
    // Only populated when role === 'supplier'
    // ════════════════════════════════════════════════

    supplierDetails: {
      businessName: {
        type: String,
        trim: true,
        // e.g. "Osho Chemicals Ltd", "Kenya Seed Company Nakuru Branch"
      },
      businessRegNo: {
        type: String,
        trim: true,
        // Business registration number from the Registrar of Companies
        // Admin uses this to verify the supplier is a legitimate business
      },
      isVerified: {
        type: Boolean,
        default: false,
        // When a supplier registers, isVerified starts as false.
        // An admin reviews their business details and sets it to true.
        // Unverified suppliers cannot create listings.
        // This protects farmers from fake or fraudulent suppliers.
      },
    },

    // ════════════════════════════════════════════════
    // SECTION 6 — ACCOUNT STATUS & TRACKING
    // ════════════════════════════════════════════════

    isActive: {
      type: Boolean,
      default: true,
      // Admin can set to false to suspend an account.
      // Suspension is reversible — actual deletion loses all order history.
      // Platform policy should prefer suspension over deletion.
    },

    lastLogin: {
      type: Date,
      // Updated every time the user successfully logs in.
      // Useful for admin analytics: "47 farmers logged in this week"
    },

    // ════════════════════════════════════════════════
    // SECTION 7 — PASSWORD RESET TOKENS (Sprint 6)
    // Leave empty for now — filled in when you build
    // the "Forgot Password" feature
    // ════════════════════════════════════════════════

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },

  {
    timestamps: true,
    // This single option adds TWO fields automatically to every document:
    //   createdAt: Date  — when the account was created
    //   updatedAt: Date  — when the account was last changed
    // You never need to set these manually. Mongoose manages them.
    // They appear in MongoDB Atlas if you look at a document there.
  }
);

// ════════════════════════════════════════════════════════════
// PRE-SAVE HOOK — Password Hashing
// ════════════════════════════════════════════════════════════
// This function runs automatically BEFORE every document.save() call.
// Its job is to hash the password if it was modified.

userSchema.pre('save', async function () {
  // 'this' refers to the specific User document being saved right now.
  // Think of it as: the user object you're about to write to the database.

  // If password was NOT changed (e.g., user updated their phone number),
  // skip hashing and settle the promise early.
  if (!this.isModified('password')) return;

  // Hash the password directly. Passing the number 12 as the second argument
  // automatically handles salt generation with a cost factor of 12.
  // This transformation is ONE-WAY. You cannot reverse a bcrypt hash.
  this.password = await bcrypt.hash(this.password, 12);
  
  // No next() call needed here! Express/Mongoose moves forward automatically when this async block finishes.
});

// ════════════════════════════════════════════════════════════
// INSTANCE METHOD — comparePassword
// ════════════════════════════════════════════════════════════
// Called during login: user.comparePassword(inputFromLoginForm)

userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare() hashes the candidate and compares it to the stored hash
  // Returns true if they match (correct password), false if they don't
  return bcrypt.compare(candidatePassword, this.password);
};

// ════════════════════════════════════════════════════════════
// INSTANCE METHOD — toJSON (security: strips sensitive fields)
// ════════════════════════════════════════════════════════════
// When Express sends a User object in an API response (res.json(user)),
// it calls .toJSON() first. This method removes the password hash
// and reset tokens so they NEVER appear in any API response.

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

// ════════════════════════════════════════════════════════════
// CREATE AND EXPORT THE MODEL
// ════════════════════════════════════════════════════════════
// mongoose.model('User', userSchema) does two things:
//   1. Creates a MongoDB collection called "users" (lowercase + plural, automatic)
//   2. Returns a JavaScript class you use to interact with that collection
//
// Usage examples (in future controllers):
//   const newUser = new User({ fullName: 'John', email: '...' })
//   await newUser.save()
//   const found = await User.findOne({ email: 'john@gmail.com' })

const User = mongoose.model('User', userSchema);
module.exports = User;