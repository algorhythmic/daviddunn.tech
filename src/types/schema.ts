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
  albumId: string;
  tags: string[];
  metadata: {
    dateTaken: Date;
    camera?: {
      make: string;
      model: string;
    };
    location?: {
      name: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  };
  isFeatured?: boolean;
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
