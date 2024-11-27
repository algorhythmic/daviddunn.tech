import { ObjectId } from 'mongodb';

// MongoDB Schemas
export interface BlogPost {
  _id: string | ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  category: string;
  tags: string[];
  readingTime: number;
  status: 'draft' | 'published';
  featuredImage?: string;
  // SEO metadata
  seoTitle?: string;
  seoDescription?: string;
  // Table of contents
  tableOfContents?: {
    items: TableOfContentsItem[];
  };
}

export interface TableOfContentsItem {
  title: string;
  url: string;
  items?: TableOfContentsItem[];
}

export interface IPhoto {
  _id: string | ObjectId;
  title: string;
  description: string;
  url?: string;
  s3Key: string;
  thumbnailUrl?: string;
  category: string;
  camera?: string;
  lens?: string;
  tags: string[];
  location?: string;
  dateTaken: Date;
  dateUploaded: Date;
  width?: number;
  height?: number;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: string;
  latitude?: number;
  longitude?: number;
  src?: string;
  size?: number;
  mimeType?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
}

export interface Album {
  _id: string | ObjectId;
  title: string;
  description: string;
  coverPhotoUrl: string;
  category: string;
  tags: string[];
  photoCount: number;
  dateCreated: Date;
  dateUpdated: Date;
  keywords: string[];
  location?: string;
}

// Supabase Schemas
export interface StreamlitApp {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  category: string;
  display_order: number;
  last_checked: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AppAnalytics {
  id: string;
  app_id: string;
  event_type: 'view' | 'interaction' | 'error';
  event_data: {
    page?: string;
    component?: string;
    action?: string;
    value?: string | number;
    error?: {
      message: string;
      stack?: string;
    };
    metadata?: Record<string, string | number | boolean>;
  };
  timestamp: Date;
}
