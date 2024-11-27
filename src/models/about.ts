import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutContent extends Document {
  _id: string;
  statement?: string;
  resumeUrl?: string;
  previewImages?: {
    resume?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  lastUpdated?: Date;
}

const AboutContentSchema = new Schema<IAboutContent>({
  statement: { type: String },
  resumeUrl: { type: String },
  previewImages: {
    resume: { type: String },
    linkedin: { type: String },
    github: { type: String },
    instagram: { type: String }
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    instagram: { type: String }
  },
  lastUpdated: { type: Date }
}, {
  strict: false // Allow additional fields
});

// Ensure indexes
AboutContentSchema.index({ lastUpdated: -1 });

export const AboutContent = mongoose.models.AboutContent || mongoose.model<IAboutContent>('AboutContent', AboutContentSchema);
