const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A produce item must have a name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A produce item must have a category'],
    },
    price: {
      type: Number, // 🛠️ FIX: Removed the execution parentheses ()
      required: [true, 'A produce item must have a price'],
    },
    quantity: {
      type: Number,
      required: [true, 'A produce item must have a quantity'],
    },
    status: {      
      type: String,
      enum: ['available', 'sold-out', 'pending'],
      default: 'available',
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'Produce must belong to a farmer'],
    },
  },
  {
    timestamps: true,
  }
);

// THE CRITICAL CJS EXPORT
module.exports = mongoose.model('Produce', produceSchema);