const express = require('express');
const router = express.Router();

const Order = require('../models/Order.model.js');
const Produce = require('../models/Produce.model.js');

// 🚨 FIX: Split these up so restrictTo pulls from roleMiddleware
const { protect } = require('../middleware/authMiddleware.js');
const { restrictTo } = require('../middleware/roleMiddleware.js'); 

// ... Your router.post('/', protect, restrictTo('buyer')...) will work perfectly now!

// 🚨 FIX 2: Removed the duplicate "const router = express.Router();" declaration from here

// ... Your router.get, router.post, and other route handlers go here ...

// Buyer — place an order
router.post('/', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const { produceId, quantity, notes } = req.body;
    const produce = await Produce.findById(produceId);
    if (!produce) return res.status(404).json({ message: 'Produce not found' });

    const totalPrice = produce.pricePerUnit * quantity;
    const order = await Order.create({
      buyer: req.user._id,
      produce: produceId,
      farmer: produce.farmer,
      quantity,
      totalPrice,
      notes
    });

    await order.populate(['produce', { path: 'farmer', select: 'name' }]);
    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Buyer — my orders
router.get('/my-orders', protect, restrictTo('buyer'), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('produce', 'name pricePerUnit unit')
      .populate('farmer', 'name')
      .sort('-createdAt');
    res.json({ status: 'success', data: { orders } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Farmer — orders for my produce
router.get('/incoming', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('produce', 'name')
      .populate('buyer', 'name')
      .sort('-createdAt');
    res.json({ status: 'success', data: { orders } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Farmer — update order status
router.patch('/:id/status', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ status: 'success', data: { order } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

module.exports = router;