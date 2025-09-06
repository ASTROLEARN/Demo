const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { auth } = require('../middleware/auth');

// All routes are protected - user must be authenticated
router.use(auth);

// @route   GET /api/events
// @desc    Get all events for authenticated user
// @access  Private
router.get('/', getEvents);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', createEvent);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Private
router.get('/:id', getEvent);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put('/:id', updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', deleteEvent);

module.exports = router;