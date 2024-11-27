import mongoose, { Model, Document } from 'mongoose';

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

export interface IPostDocument extends Document, IPost {}

export interface IPostWithId extends IPost {
  _id: mongoose.Types.ObjectId;
  __v?: number;
}

const PostSchema = new mongoose.Schema<IPostDocument>({
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

export const PostModel: Model<IPostDocument> = mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);

export const post = {
  count: async (options?: { where?: Partial<IPost> }) => {
    try {
      const filter = options?.where || {};
      return await PostModel.countDocuments(filter);
    } catch (error) {
      console.error('Error counting posts:', error);
      return 0;
    }
  },
  find: async (options?: { 
    where?: Partial<IPost>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
  }) => {
    try {
      const filter = options?.where || {};
      let query = PostModel.find(filter);
      
      if (options?.sort) {
        query = query.sort(options.sort);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const docs = await query.lean().exec();
      return docs as unknown as IPostWithId[];
    } catch (error) {
      console.error('Error finding posts:', error);
      return [] as IPostWithId[];
    }
  }
};

export default PostModel;
