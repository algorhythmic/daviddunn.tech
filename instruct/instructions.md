## Product Requirements Document: Personal Portfolio Website

A modern, performant personal website built with Next.js, React, and TypeScript, featuring a photo gallery, blog posts, and analytics applications integration.

## Technical Stack

**Frontend**

- Next.js 14 with App Router
- React.js with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- NPM for package management
- Lucide for icons
- Googlefont for typeface

**Backend**

- Next.js API routes
- MongoDB Atlas for content storage
- Supabase for authentication and structured data
- Next.js Image optimization
- Vercel deployment

## Core Features

**Layout & Navigation**

- Responsive design with mobile-first approach
- Dark/light mode with system preference detection
- Global search functionality
- Sticky navigation header
- Collapsible Table of Contents sidebar

**Photo Gallery**

- Category-based organization
- Grid layout with masonry support
- Image optimization and lazy loading
- Modal view for full-size images
- Metadata display and filtering

**Blog Section**

- MDX support for rich content
- Syntax highlighting for code blocks
- Category and tag system
- Reading time estimation
- Related posts suggestions

**Analytics Apps Integration**

- Streamlit apps embedding
- Preview cards with live status
- Responsive iframes
- Error handling for offline apps

## Database Architecture

**MongoDB Atlas**

- Blog posts and content
- Photo metadata and categories
- Analytics apps configuration
- Search indices

**Supabase**

- User authentication
- Structured data relationships
- API access control
- Real-time updates

## Development Phases

**Phase 1: Foundation**

1. Project setup with Next.js
2. Database schema design
3. Authentication implementation
4. Basic layout and navigation

**Phase 2: Content Management**

1. Photo gallery implementation
2. Blog functionality
3. Search integration
4. Content management system

**Phase 3: Analytics Integration**

1. Streamlit apps embedding
2. Analytics dashboard
3. Performance optimization
4. Error handling

**Phase 4: Polish**

1. SEO optimization
2. Performance tuning
3. Documentation
4. Testing and deployment
