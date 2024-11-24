// MongoDB Schemas
export interface BlogPost {
  _id: string;
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

export interface Photo {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  category: string;
  albumId?: string;
  tags: string[];
  metadata: {
    dateTaken: Date;
    camera?: string;
    lens?: string;
    settings?: {
      aperture?: string;
      shutterSpeed?: string;
      iso?: number;
      focalLength?: string;
    };
  };
}

export interface Album {
  _id: string;
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
  event_data: Record<string, any>;
  timestamp: Date;
}
