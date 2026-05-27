// FILE: agrilink-backend/models/InputRequest.js
// PURPOSE: Records a farmer's purchase request to a supplier for inputs
// RELATIONSHIPS: references User (farmer), User (supplier), SupplierProduct

const mongoose = require('mongoose');

const inputRequestSchema = new mongoose.Schema(
  {
    // ════════════════════════════════════════════════
    // SECTION 1 — THE TWO PARTIES
    // ════════════════════════════════════════════════

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Input request must come from a farmer'],
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Input request must be directed to a supplier'],
      // Stored directly (not just via SupplierProduct) for the same
      // performance reason as storing farmer on Order.
    },

    supplierProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SupplierProduct',
      required: [true, 'Input request must reference a product'],
    },

    // ════════════════════════════════════════════════
    // SECTION 2 — PRODUCT SNAPSHOT (same principle as Order)
    // ════════════════════════════════════════════════

    productSnapshot: {
      name: { type: String },
      pricePerUnit: { type: Number },
      unit: { type: String },
      brand: { type: String },
      // Preserves what was agreed at request time.
      // If supplier changes price next week, this order is unaffected.
    },

    // ════════════════════════════════════════════════
    // SECTION 3 — ORDER DETAILS
    // ════════════════════════════════════════════════

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },

    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },

    // ════════════════════════════════════════════════
    // SECTION 4 — DELIVERY
    // ════════════════════════════════════════════════

    deliveryAddress: {
      street: { type: String, trim: true },
      town: { type: String, trim: true },
      county: { type: String, trim: true },
    },

    preferredDeliveryDate: { type: Date },

    // ════════════════════════════════════════════════
    // SECTION 5 — STATUS (more granular than Order)
    // ════════════════════════════════════════════════

    status: {
      type: String,
      enum: {
        values: [
          'pending',     // Submitted, awaiting supplier confirmation
          'confirmed',   // Supplier reviewed and accepted the request
          'processing',  // Supplier is packing / preparing the order
          'shipped',     // Order is in transit to the farmer
          'delivered',   // Farmer received the inputs
          'cancelled',   // Farmer or supplier cancelled
        ],
        message: '"{VALUE}" is not a valid input request status',
      },
      default: 'pending',
      // WHY more status steps than a regular Order:
      // Physical supply chains have more stages than produce pickup.
      // Fertilizer orders get packed in a warehouse, loaded on a lorry,
      // driven to the county, and then hand-delivered.
      // Farmers waiting for seeds before planting season need to know
      // which stage their order is at — 'shipped' vs 'processing' matters.
    },

    // ════════════════════════════════════════════════
    // SECTION 6 — NOTES
    // ════════════════════════════════════════════════

    farmerNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      // e.g. "Please deliver before 15th March — planting season starts then"
    },

    supplierNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      // e.g. "Will dispatch Monday. Driver will call before arrival."
    },

    // ════════════════════════════════════════════════
    // SECTION 7 — WORKFLOW TIMESTAMPS
    // ════════════════════════════════════════════════

    confirmedAt: { type: Date },
    processedAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
    // Same principle as Order workflow timestamps.
    // These let you calculate: "Average shipping time: 2.3 days"
  },
  { timestamps: true }
);

// ════════════════════════════════════════════════════════════
// INDEXES
// ════════════════════════════════════════════════════════════

inputRequestSchema.index({ farmer: 1, status: 1 });
inputRequestSchema.index({ supplier: 1, status: 1 });
inputRequestSchema.index({ supplierProduct: 1 });
inputRequestSchema.index({ createdAt: -1 });

const InputRequest = mongoose.model('InputRequest', inputRequestSchema);
module.exports = InputRequest;