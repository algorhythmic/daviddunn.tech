import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  description: string;
  coverImageUrl: string;
  location: string;
  tags: string[];
  photoCount: number;
  dateCreated: Date;
  dateUpdated: Date;
}

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImageUrl: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  tags: [{ type: String }],
  photoCount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Add text index for search functionality
AlbumSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  location: 'text',
});

// Check if the model exists before creating a new one
const Album = mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);

export { Album };
