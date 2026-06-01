const express = require('express');
const router = express.Router();
const Produce = require('../models/Produce.model.js');

// 💡 Split the imports between auth and role middlewares
const { protect } = require('../middleware/authMiddleware.js');
const { restrictTo } = require('../middleware/roleMiddleware.js');

// 🚨 FIX 2: Removed the duplicate "const router = express.Router();" declaration that was here

// Public — all authenticated users can browse
router.get('/', protect, async (req, res) => {
  try {
    const filter = { status: 'available' };
    if (req.query.category) filter.category = req.query.category;

    const produce = await Produce.find(filter)
      .populate('farmer', 'name location')
      .sort('-createdAt');

    res.json({ status: 'success', results: produce.length, data: { produce } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Farmer only — get MY listings
router.get('/my-listings', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const produce = await Produce.find({ farmer: req.user._id }).sort('-createdAt');
    res.json({ status: 'success', data: { produce } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Farmer only — create listing
router.post('/', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const produce = await Produce.create({ ...req.body, farmer: req.user._id });
    res.status(201).json({ status: 'success', data: { produce } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Farmer only — update listing
router.patch('/:id', protect, restrictTo('farmer'), async (req, res) => {
  try {
    const produce = await Produce.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!produce) return res.status(404).json({ message: 'Listing not found' });
    res.json({ status: 'success', data: { produce } });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// Farmer only — delete listing
router.delete('/:id', protect, restrictTo('farmer'), async (req, res) => {
  try {
    await Produce.findOneAndDelete({ _id: req.params.id, farmer: req.user._id });
    res.json({ status: 'success', message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;