import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutContent extends Document {
  statement: string;
  resumeUrl: string;
  previewImages: {
    resume: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
  socialLinks: {
    linkedin: string;
    github: string;
    instagram: string;
  };
  lastUpdated: Date;
}

const AboutContentSchema = new Schema<IAboutContent>({
  statement: { type: String, required: true, default: '' },
  resumeUrl: { type: String, required: true },
  previewImages: {
    resume: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    instagram: { type: String, required: true },
  },
  socialLinks: {
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    instagram: { type: String, required: true },
  },
  lastUpdated: { type: Date, default: Date.now },
});

export const AboutContent = mongoose.models.AboutContent || mongoose.model<IAboutContent>('AboutContent', AboutContentSchema);
