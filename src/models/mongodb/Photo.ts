import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

interface PhotoMetadataSettings {
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: string;
}

interface PhotoMetadata {
  dateTaken?: Date;
  camera?: string;
  lens?: string;
  settings?: PhotoMetadataSettings;
}

export interface IPhoto extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  location?: string;
  s3Key: string;
  url: string;
  size: number;
  mimeType: string;
  dateCreated: Date;
  dateUpdated: Date;
  tags: string[];
  metadata?: PhotoMetadata;
}

export type Photo = IPhoto;

const photoSchema = new Schema<IPhoto>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String },
  s3Key: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  tags: [{ type: String }],
  metadata: {
    dateTaken: { type: Date },
    camera: { type: String },
    lens: { type: String },
    settings: {
      aperture: { type: String },
      shutterSpeed: { type: String },
      iso: { type: Number },
      focalLength: { type: String }
    }
  }
}, {
  timestamps: {
    createdAt: 'dateCreated',
    updatedAt: 'dateUpdated'
  }
});

// Create text index for search
photoSchema.index({ 
  title: 'text', 
  description: 'text',
  location: 'text',
  tags: 'text'
});

// Create indexes for better query performance
photoSchema.index({ s3Key: 1 }, { unique: true });
photoSchema.index({ dateCreated: -1 });

// Check if the model exists before creating it
const Photo = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', photoSchema);
export default Photo;
