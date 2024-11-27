import mongoose, { Document } from 'mongoose';
import { IPhoto } from '@/types/schema';

export interface IPhotoDocument extends Document, Omit<IPhoto, '_id'> {}

export interface IPhotoWithId extends IPhoto {
  _id: mongoose.Types.ObjectId;
  __v?: number;
}

const PhotoSchema = new mongoose.Schema<IPhotoDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  s3Key: { type: String, required: true },
  url: String,
  thumbnailUrl: String,
  category: { type: String, required: true },
  camera: String,
  lens: String,
  tags: [{ type: String }],
  location: String,
  dateTaken: { type: Date, required: true },
  dateUploaded: { type: Date, default: Date.now },
  width: Number,
  height: Number,
  aperture: String,
  shutterSpeed: String,
  iso: Number,
  focalLength: String,
  latitude: Number,
  longitude: Number,
  src: String
});

// Add text index for search functionality
PhotoSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  location: 'text' 
});

export const PhotoModel = mongoose.models.Photo || mongoose.model<IPhotoDocument>('Photo', PhotoSchema);

export const photo = {
  count: async (options?: { where?: Partial<IPhoto> }) => {
    try {
      const filter = options?.where || {};
      return await PhotoModel.countDocuments(filter);
    } catch (error) {
      console.error('Error counting photos:', error);
      return 0;
    }
  },
  find: async (options?: { 
    where?: Partial<IPhoto>;
    sort?: Record<string, 1 | -1>;
    limit?: number;
  }) => {
    try {
      const filter = options?.where || {};
      let query = PhotoModel.find(filter);
      
      if (options?.sort) {
        query = query.sort(options.sort);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const docs = await query.lean().exec();
      return docs as unknown as IPhotoWithId[];
    } catch (error) {
      console.error('Error finding photos:', error);
      return [] as IPhotoWithId[];
    }
  }
};

export default PhotoModel;
