import mongoose from 'mongoose';

export interface IPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  category: string;
  published: boolean;
  publishedAt?: Date;
  updatedAt: Date;
  metadata: {
    readingTime?: number;
    views?: number;
    likes?: number;
  };
}

const PostSchema = new mongoose.Schema<IPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  coverImage: String,
  tags: [{ type: String }],
  category: { type: String, required: true },
  published: { type: Boolean, default: false },
  publishedAt: Date,
  updatedAt: { type: Date, default: Date.now },
  metadata: {
    readingTime: Number,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
});

// Add text index for search functionality
PostSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text',
});

// Pre-save hook to generate slug from title
PostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
