// models/Supplier.js
// Agricultural input suppliers (seeds, fertilizer, equipment)

const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    productsOffered: [
      {
        name: String,       // e.g. "Calcium Ammonium Nitrate"
        category: String,   // e.g. "fertilizer"
        price: Number,
        unit: String,
      },
    ],
    location: {
      county: String,
      town: String,
      address: String,
    },
    contactPhone: String,
    contactEmail: String,
    website: String,
    isVerified: {
      type: Boolean,
      default: false, // admin must verify suppliers
    },
    logo: String, // Cloudinary URL
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Supplier', SupplierSchema);