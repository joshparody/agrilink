// models/Product.js
// A produce listing posted by a farmer

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId, // references the User collection
      ref: 'User', // tells Mongoose which collection to look in
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      // e.g. "Fresh Tomatoes - Nyahururu Farm"
    },
    category: {
      type: String,
      required: true,
      enum: [
        'vegetables',
        'fruits',
        'grains',
        'dairy',
        'poultry',
        'livestock',
        'other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price is required'],
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'gram', 'litre', 'piece', 'crate', 'bag', 'dozen'],
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    images: [
      {
        type: String, // Array of Cloudinary URLs
      },
    ],
    location: {
      county: { type: String },
      town: { type: String },
    },
    isAvailable: {
      type: Boolean,
      default: true, // farmer can mark as sold out
    },
    views: {
      type: Number,
      default: 0, // track how many buyers viewed this listing
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search queries on category and location
ProductSchema.index({ category: 1, 'location.county': 1 });
ProductSchema.index({ title: 'text', description: 'text' }); // enables text search

module.exports = mongoose.model('Product', ProductSchema);