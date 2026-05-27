// FILE: agrilink-backend/models/Order.js
// PURPOSE: Records a buyer's purchase of a farmer's produce listing
// RELATIONSHIPS: references User (buyer), User (farmer), and Product

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // ════════════════════════════════════════════════
    // SECTION 1 — THE THREE PARTIES
    // ════════════════════════════════════════════════

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must have a buyer'],
      // The User with role:'buyer' who placed this order
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must have a farmer'],
      // WHY store farmer on the Order even though it's already on the Product?
      // Performance: "Give me all orders assigned to farmer X" runs in one
      // simple query: Order.find({ farmer: userId }).
      // Without this field, you'd have to first fetch all products for that
      // farmer, then search all orders for each product ID — much slower.
      // This trade-off of a little data duplication for query speed is
      // called "denormalization" and is a standard MongoDB pattern.
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Order must reference a product'],
    },

    // ════════════════════════════════════════════════
    // SECTION 2 — PRODUCT SNAPSHOT
    // ════════════════════════════════════════════════

    productSnapshot: {
      name: { type: String },
      pricePerUnit: { type: Number },
      unit: { type: String },
      // WHY snapshot the product details on the Order?
      //
      // SCENARIO: A farmer lists tomatoes at KSh 80/kg.
      // Buyer places an order. Farmer later updates the price to KSh 120/kg.
      //
      // WITHOUT snapshot: The order now shows KSh 120/kg — wrong and misleading.
      // WITH snapshot: The order permanently shows KSh 80/kg — what was agreed.
      //
      // This is standard practice in every e-commerce platform.
      // Think of it as a receipt: the receipt shows the price you PAID,
      // not the current price of the item.
    },

    // ════════════════════════════════════════════════
    // SECTION 3 — ORDER QUANTITY AND PRICE
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
      // Calculated as: quantity × pricePerUnit at time of order
      // Stored permanently — does not change if product price changes later
    },

    // ════════════════════════════════════════════════
    // SECTION 4 — THE STATUS STATE MACHINE
    // ════════════════════════════════════════════════
    //
    // This is the WORKFLOW ENGINE of your entire platform.
    // Every valid status transition:
    //
    //   pending ──→ accepted ──→ fulfilled
    //            ↘ rejected  (terminal — no more transitions)
    //   pending ──→ cancelled (buyer backs out before acceptance)
    //   any ──────→ disputed  (problem arose, admin steps in)
    //
    // In Sprint 4, you will write controller functions that
    // handle each transition and validate they follow these rules.

    status: {
      type: String,
      enum: {
        values: [
          'pending',    // Buyer placed order. Farmer has not yet responded.
          'accepted',   // Farmer confirmed: "Yes, I can fulfill this."
          'rejected',   // Farmer declined: out of stock, bad terms, etc.
          'fulfilled',  // Produce delivered and transaction complete.
          'cancelled',  // Buyer cancelled before farmer responded.
          'disputed',   // Something went wrong. Admin must investigate.
        ],
        message: '"{VALUE}" is not a valid order status',
      },
      default: 'pending',
    },

    // ════════════════════════════════════════════════
    // SECTION 5 — DELIVERY DETAILS
    // ════════════════════════════════════════════════

    deliveryMethod: {
      type: String,
      required: [true, 'Please specify delivery method'],
      enum: {
        values: ['pickup', 'delivery'],
        message: 'Delivery method must be either "pickup" or "delivery"',
      },
      // pickup   → buyer travels to the farm to collect
      // delivery → farmer or courier brings to buyer's location
    },

    deliveryAddress: {
      // Only required when deliveryMethod === 'delivery'
      // Your controller should validate: if deliveryMethod is 'delivery',
      // then deliveryAddress.county must exist.
      street: { type: String, trim: true },
      town: { type: String, trim: true },
      county: { type: String, trim: true },
      instructions: {
        type: String,
        trim: true,
        // e.g. "Call when you reach the gate", "Leave with the watchman"
      },
    },

    preferredDeliveryDate: {
      type: Date,
      // The date the buyer would LIKE to receive the produce.
      // Farmer can accept this date or message the buyer to negotiate.
    },

    // ════════════════════════════════════════════════
    // SECTION 6 — NOTES BETWEEN PARTIES
    // ════════════════════════════════════════════════

    buyerNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      // e.g. "Please provide an invoice", "Pack in separate bags per variety"
    },

    farmerNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
      // Set when farmer accepts or rejects:
      // Accept: "Will be ready by Thursday afternoon"
      // Reject: "Sorry, heavy rains damaged this batch"
    },

    // ════════════════════════════════════════════════
    // SECTION 7 — WORKFLOW TIMESTAMPS
    // ════════════════════════════════════════════════
    // These let you track HOW LONG each stage takes.
    // Your admin dashboard can show: "Average farmer response time: 4 hours"

    acceptedAt: { type: Date },   // Set when status → 'accepted'
    rejectedAt: { type: Date },   // Set when status → 'rejected'
    fulfilledAt: { type: Date },  // Set when status → 'fulfilled'
    cancelledAt: { type: Date },  // Set when status → 'cancelled'

    // ════════════════════════════════════════════════
    // SECTION 8 — PAYMENT (ready for Phase 2)
    // ════════════════════════════════════════════════

    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
      // AgriLink v1 uses cash on delivery — no online payment processing.
      // This field is here so that when you add M-Pesa integration later,
      // you don't need to change the database schema.
      // Planning for future features in your schema now is called
      // "schema forward-compatibility" — mention this in your report.
    },
  },
  {
    timestamps: true,
    // createdAt = the exact moment the buyer placed the order
    // updatedAt = last time any field on the order was changed
  }
);

// ════════════════════════════════════════════════════════════
// INDEXES
// ════════════════════════════════════════════════════════════

orderSchema.index({ buyer: 1, status: 1 });
// "Show all pending orders for buyer X" — used on buyer's Orders dashboard

orderSchema.index({ farmer: 1, status: 1 });
// "Show all accepted orders for farmer X" — used on farmer's Orders dashboard

orderSchema.index({ product: 1 });
// "How many orders has this product received?" — for product analytics

orderSchema.index({ createdAt: -1 });
// -1 = descending (newest first). Most order lists show newest first.

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;