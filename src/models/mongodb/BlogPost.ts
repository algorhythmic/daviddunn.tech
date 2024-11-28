import mongoose, { Schema } from 'mongoose';
import type { BlogPost } from '@/types/schema';

const blogPostSchema = new Schema<BlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  category: { type: String, required: true },
  tags: [{ type: String, required: true }],
  readingTime: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'published'], required: true },
  featuredImage: { type: String },
  seoTitle: { type: String },
  seoDescription: { type: String },
  tableOfContents: {
    type: {
      items: [{
        title: { type: String, required: true },
        url: { type: String, required: true },
        items: {
          type: [{
            title: { type: String, required: true },
            url: { type: String, required: true },
            items: [{ type: Schema.Types.Mixed }]
          }],
          required: false
        }
      }]
    },
    required: false
  }
}, {
  timestamps: true,
});

// Create indexes for better query performance
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ tags: 1 });

export default mongoose.models.BlogPost || mongoose.model<BlogPost>('BlogPost', blogPostSchema);
