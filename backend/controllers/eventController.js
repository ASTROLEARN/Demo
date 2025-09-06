const supabase = require('../config/supabase');

const getEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        users!created_by(name, email)
      `)
      .eq('created_by', req.user.id)
      .order('date', { ascending: true });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
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
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        users!created_by(name, email)
      `)
      .eq('id', req.params.id)
      .eq('created_by', req.user.id)
      .single();
    
    if (error || !event) {
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
      created_by: req.user.id
    };
    
    const { data: event, error } = await supabase
      .from('events')
      .insert([eventData])
      .select(`
        *,
        users!created_by(name, email)
      `)
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
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
    const { data: event, error } = await supabase
      .from('events')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('created_by', req.user.id)
      .select(`
        *,
        users!created_by(name, email)
      `)
      .single();
    
    if (error || !event) {
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
    const { data: event, error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id)
      .eq('created_by', req.user.id)
      .select()
      .single();
    
    if (error || !event) {
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