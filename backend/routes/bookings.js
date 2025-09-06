const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// All routes are protected - user must be authenticated
router.use(auth);

// @route   GET /api/bookings
// @desc    Get all bookings for authenticated user
// @access  Private
router.get('/', getBookings);

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', createBooking);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', getBooking);

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', updateBooking);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', deleteBooking);

module.exports = router;