const mongoose =require('mongoose');

const supplySchema = new mongoose.Schema({
  supplier:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  category:    { type: String, required: true, enum: ['seeds','fertilizers','pesticides','equipment','packaging','other'] },
  quantity:    { type: Number, required: true },
  unit:        { type: String, required: true, enum: ['kg','litres','pieces','bags','boxes'] },
  pricePerUnit:{ type: Number, required: true },
  location:    { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['available','out_of_stock'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Supply', supplySchema);