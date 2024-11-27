import mongoose from 'mongoose';

export interface IPhoto {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  s3Key: string;
  url?: string;
  category: string;
  tags: string[];
  location?: string;
  dateTaken: Date;
  dateUploaded: Date;
  width?: number;
  height?: number;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: {
      aperture?: string;
      shutterSpeed?: string;
      iso?: number;
      focalLength?: string;
    };
    width?: number;
    height?: number;
  };
  src?: string;
}

const PhotoSchema = new mongoose.Schema<IPhoto>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  s3Key: { type: String, required: true },
  url: String,
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
      focalLength: String
    },
    width: Number,
    height: Number
  },
  width: Number,
  height: Number,
  src: String
});

// Add text index for search functionality
PhotoSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  location: 'text' 
});

// Create and export the model
const PhotoModel = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);

export type PhotoDocument = mongoose.Document & IPhoto;
export default PhotoModel;
