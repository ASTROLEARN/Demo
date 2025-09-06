const Vendor = require('../models/Vendor');

const getVendors = async (req, res) => {
  try {
    const { category, availability, rating, search } = req.query;
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category.toLowerCase();
    }
    
    // Filter by availability
    if (availability !== undefined) {
      query.availability = availability === 'true';
    }
    
    // Filter by minimum rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const vendors = await Vendor.find(query).sort({ rating: -1, name: 1 });
    
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
    const vendor = await Vendor.findById(req.params.id);
    
    if (!vendor) {
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
    const vendor = new Vendor(req.body);
    await vendor.save();
    
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
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vendor) {
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
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    
    if (!vendor) {
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