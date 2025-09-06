const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Vendor category is required'],
    enum: ['catering', 'decoration', 'photography', 'venue', 'entertainment', 'other'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Vendor description is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  contact: {
    email: String,
    phone: String
  },
  priceRange: {
    type: String,
    enum: ['low', 'mid', 'high'],
    default: 'mid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);