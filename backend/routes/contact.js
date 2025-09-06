const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContactStatus
} = require('../controllers/contactController');
const { adminAuth } = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', createContact);

// Admin only routes
// @route   GET /api/contact
// @desc    Get all contact submissions
// @access  Private (Admin only)
router.get('/', adminAuth, getContacts);

// @route   PUT /api/contact/:id
// @desc    Update contact status
// @access  Private (Admin only)
router.put('/:id', adminAuth, updateContactStatus);

module.exports = router;