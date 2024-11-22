import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutContent extends Document {
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
