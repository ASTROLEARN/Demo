const Booking = require('../models/Booking');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('eventId', 'title date location')
      .populate('vendorId', 'name category rating')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    })
    .populate('eventId', 'title date location')
    .populate('vendorId', 'name category rating contact')
    .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { eventId, vendorId, notes } = req.body;
    
    // Check if booking already exists for this vendor and event
    const existingBooking = await Booking.findOne({ eventId, vendorId });
    if (existingBooking) {
      return res.status(400).json({ 
        error: 'This vendor is already booked for this event' 
      });
    }
    
    const bookingData = {
      eventId,
      vendorId,
      userId: req.user._id,
      notes
    };
    
    const booking = new Booking(bookingData);
    await booking.save();
    
    await booking.populate([
      { path: 'eventId', select: 'title date location' },
      { path: 'vendorId', select: 'name category rating' },
      { path: 'userId', select: 'name email' }
    ]);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        error: 'This vendor is already booked for this event' 
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    .populate('eventId', 'title date location')
    .populate('vendorId', 'name category rating')
    .populate('userId', 'name email');
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
};