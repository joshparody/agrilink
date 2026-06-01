const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  produce:    { type: mongoose.Schema.Types.ObjectId, ref: 'Produce', required: true },
  farmer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity:   { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status:     { type: String, enum: ['pending','confirmed','delivered','cancelled'], default: 'pending' },
  notes:      { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);