const express = require('express');
const router = express.Router();

// 🚨 FIX: Converted ES6 imports to CommonJS require statements
const Supply = require('../models/Supply.model.js');
const { protect } = require('../middleware/authMiddleware.js');
const { restrictTo } = require('../middleware/roleMiddleware.js');

// All authenticated users can browse supplies
router.get('/', protect, async (req, res) => {
  try {
    const supplies = await Supply.find({ status: 'available' })
      .populate('supplier', 'name location')
      .sort('-createdAt');
    res.json({ status: 'success', data: { supplies } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Supplier — my catalogue
router.get('/my-supplies', protect, restrictTo('supplier'), async (req, res) => {
  try {
    const supplies = await Supply.find({ supplier: req.user._id }).sort('-createdAt');
    res.json({ status: 'success', data: { supplies } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Supplier — add supply
router.post('/', protect, restrictTo('supplier'), async (req, res) => {
  try {
    const supply = await Supply.create({ ...req.body, supplier: req.user._id });
    res.status(201).json({ status: 'success', data: { supply } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Supplier — update
router.patch('/:id', protect, restrictTo('supplier'), async (req, res) => {
  try {
    const supply = await Supply.findOneAndUpdate(
      { _id: req.params.id, supplier: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!supply) return res.status(404).json({ message: 'Supply not found' });
    res.json({ status: 'success', data: { supply } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Supplier — delete
router.delete('/:id', protect, restrictTo('supplier'), async (req, res) => {
  try {
    await Supply.findOneAndDelete({ _id: req.params.id, supplier: req.user._id });
    res.json({ status: 'success', message: 'Supply deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;