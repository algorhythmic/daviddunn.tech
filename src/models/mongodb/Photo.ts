import mongoose, { Schema } from 'mongoose';
import type { Photo } from '@/types/schema';

const photoSchema = new Schema<Photo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String, required: true }],
  metadata: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    size: { type: Number, required: true },
    takenAt: { type: Date },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      name: { type: String }
    },
    camera: {
      make: { type: String },
      model: { type: String },
      settings: {
        iso: { type: Number },
        aperture: { type: String },
        shutterSpeed: { type: String },
        focalLength: { type: String }
      }
    }
  },
  uploadedAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
}, {
  timestamps: true
});

// Create indexes for better query performance
photoSchema.index({ category: 1 });
photoSchema.index({ tags: 1 });
photoSchema.index({ uploadedAt: -1 });
photoSchema.index({ 'metadata.takenAt': -1 });

export default mongoose.models.Photo || mongoose.model<Photo>('Photo', photoSchema);
