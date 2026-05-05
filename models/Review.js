// models/Review.js
// Buyers leave reviews on farmers/products after fulfilled orders

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['product', 'farmer', 'supplier'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // references Product, User, or Supplier depending on targetType
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only review the same target once
ReviewSchema.index({ reviewer: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);