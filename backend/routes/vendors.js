const express = require('express');
const router = express.Router();
const {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/vendorController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/vendors
// @desc    Get all vendors (with optional filters)
// @access  Public
router.get('/', getVendors);

// @route   GET /api/vendors/:id
// @desc    Get single vendor
// @access  Public
router.get('/:id', getVendor);

// Admin/Vendor protected routes
// @route   POST /api/vendors
// @desc    Create a new vendor
// @access  Private (Admin only)
router.post('/', adminAuth, createVendor);

// @route   PUT /api/vendors/:id
// @desc    Update vendor
// @access  Private (Admin only)
router.put('/:id', adminAuth, updateVendor);

// @route   DELETE /api/vendors/:id
// @desc    Delete vendor
// @access  Private (Admin only)
router.delete('/:id', adminAuth, deleteVendor);

module.exports = router;