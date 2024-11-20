// MongoDB Schemas
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  categories: string[];
  tags: string[];
  readingTime: number;
  status: 'draft' | 'published';
  featuredImage?: string;
}

export interface Photo {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
    takenAt?: Date;
    location?: {
      latitude: number;
      longitude: number;
      name: string;
    };
    camera?: {
      make: string;
      model: string;
      settings?: {
        iso: number;
        aperture: string;
        shutterSpeed: string;
        focalLength: string;
      };
    };
  };
  uploadedAt: Date;
  updatedAt: Date;
}

// Supabase Schemas
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AnalyticsApp {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  category: string;
  tags: string[];
  display_order: number;
  last_checked: Date;
  created_at: Date;
  updated_at: Date;
}
