import mongoose from 'mongoose';

export interface IPhoto {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  location?: string;
  dateTaken: Date;
  dateUploaded: Date;
  metadata?: {
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

const PhotoSchema = new mongoose.Schema<IPhoto>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  location: String,
  dateTaken: { type: Date, required: true },
  dateUploaded: { type: Date, default: Date.now },
  metadata: {
    camera: String,
    lens: String,
    settings: {
      aperture: String,
      shutterSpeed: String,
      iso: Number,
      focalLength: String,
    },
  },
});

// Add text index for search functionality
PhotoSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  location: 'text',
});

export const Photo = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
