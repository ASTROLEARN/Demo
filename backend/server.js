const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Make supabase available globally for controllers
global.supabase = supabase;

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const vendorRoutes = require('./routes/vendors');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : true, // Allow all origins in development
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Cache control headers for development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 means table doesn't exist yet
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connected successfully');
    }
  } catch (error) {
    console.log('Supabase connection test skipped - tables may not exist yet');
  }
};

// Test database connection
testSupabaseConnection();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Eventify Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Eventify Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login, profile)',
      events: '/api/events (CRUD - Protected)',
      vendors: '/api/vendors (Public GET, Admin POST/PUT/DELETE)',
      bookings: '/api/bookings (CRUD - Protected)',
      contact: '/api/contact (Public POST, Admin GET/PUT)',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, 'localhost', () => {
  console.log(`Server running on localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;