const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    }).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const event = new Event(eventData);
    await event.save();
    await event.populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user._id 
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
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
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
};