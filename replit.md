# Eventify - Smart Event Planning Platform

## Overview

Eventify is a comprehensive event planning platform that connects users with vendors and provides AI-powered recommendations for event planning needs. The application focuses on making event planning stress-free, affordable, and transparent by offering vendor discovery, budget management, and instant booking capabilities. The platform serves both event planners looking for services and vendors wanting to showcase their offerings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Site Structure**: The application uses a traditional multi-page HTML structure with individual pages for different sections (home, about, services, vendors, dashboard, etc.)
- **Client-Side Interactivity**: JavaScript handles theme toggling (light/dark mode), mobile navigation, carousel functionality with auto-slide and swipe support
- **CSS Architecture**: Custom CSS with CSS variables for theming, responsive grid layouts, and component-based styling
- **Design System**: Coral/peach brand colors (#F97366) with comprehensive dark mode support, Google Fonts integration (Poppins, Dancing Script)

### Backend Architecture
- **Static File Server**: Node.js HTTP server that serves static files from the public directory
- **Routing Strategy**: File-based routing where each HTML file corresponds to a route
- **Content Type Handling**: Automatic MIME type detection for various file types (HTML, CSS, JS, images)
- **Caching Strategy**: Cache-control headers set to prevent caching for development purposes

### Data Architecture
- **No Database**: Currently operates as a static site without persistent data storage
- **Client-Side State**: User preferences (theme) stored in localStorage
- **Vendor Data**: Hard-coded vendor information within HTML templates

### User Interface Components
- **Responsive Navigation**: Sticky header with mobile-friendly hamburger menu
- **Search Functionality**: Vendor and service search interface (UI only)
- **Vendor Filtering**: Category-based filtering system for vendor discovery
- **Interactive Elements**: Availability checking, rating displays, pricing indicators

## External Dependencies

### Third-Party Services
- **Google Fonts API**: Typography integration for Poppins and Dancing Script fonts
- **Unsplash Images**: External image hosting for vendor photos and hero images
- **Builder.io CDN**: Logo and thumbnail image delivery

### Browser APIs
- **Local Storage**: Theme preference persistence
- **Match Media API**: System color scheme detection for automatic theme selection
- **File System API**: Not used (static file serving handled server-side)

### Planned Integrations
The architecture suggests preparation for:
- AI-powered vendor recommendations
- Real-time availability checking
- Payment processing integration
- Vendor management dashboard
- User authentication system
- Database integration for vendor and event data