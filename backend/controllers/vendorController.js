const supabase = require('../config/supabase');

const getVendors = async (req, res) => {
  try {
    const { category, availability, rating, search } = req.query;
    let query = supabase.from('vendors').select('*');
    
    // Filter by category
    if (category) {
      query = query.eq('category', category.toLowerCase());
    }
    
    // Filter by availability
    if (availability !== undefined) {
      query = query.eq('availability', availability === 'true');
    }
    
    // Filter by minimum rating
    if (rating) {
      query = query.gte('rating', parseFloat(rating));
    }
    
    // Search in name and description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data: vendors, error } = await query.order('rating', { ascending: false }).order('name');
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getVendor = async (req, res) => {
  try {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createVendor = async (req, res) => {
  try {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert([req.body])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error || !vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { data: vendor, error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error || !vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
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
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor
};