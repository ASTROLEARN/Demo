const supabase = require('../config/supabase');

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }
    
    const { data: contact, error } = await supabase
      .from('contact')
      .insert([{ name, email, message }])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Log the contact submission to console
    console.log('New contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createContact,
  getContacts,
  updateContactStatus
};