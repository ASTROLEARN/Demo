// Supabase table schemas for reference
// These would be created in Supabase dashboard or via SQL

const schemas = {
  // Users table
  users: `
    CREATE TABLE users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'planner' CHECK (role IN ('planner', 'vendor', 'admin')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Events table
  events: `
    CREATE TABLE events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      date TIMESTAMP WITH TIME ZONE NOT NULL,
      location VARCHAR(255) NOT NULL,
      created_by UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Vendors table
  vendors: `
    CREATE TABLE vendors (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL CHECK (category IN ('catering', 'decoration', 'photography', 'venue', 'entertainment', 'other')),
      description TEXT NOT NULL,
      rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
      availability BOOLEAN DEFAULT true,
      image_url TEXT,
      contact_email VARCHAR(255),
      contact_phone VARCHAR(50),
      price_range VARCHAR(10) DEFAULT 'mid' CHECK (price_range IN ('low', 'mid', 'high')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Bookings table
  bookings: `
    CREATE TABLE bookings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      event_id UUID REFERENCES events(id) ON DELETE CASCADE,
      vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(event_id, vendor_id)
    );
  `,

  // Contact table
  contact: `
    CREATE TABLE contact (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
};

module.exports = schemas;