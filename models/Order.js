// models/Order.js
// When a buyer places an order for a farmer's product

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'fulfilled', 'cancelled'],
      default: 'pending',
      // Flow: pending → accepted → fulfilled
      //       pending → rejected
      //       pending/accepted → cancelled
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    notes: {
      type: String, // buyer's special instructions
      default: '',
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema);