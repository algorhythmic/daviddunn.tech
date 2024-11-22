import mongoose from 'mongoose';

export interface IAlbum {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  coverImageUrl: string;
  location: string;
  tags: string[];
  photoCount: number;
  dateCreated: Date;
  dateUpdated: Date;
}

const AlbumSchema = new mongoose.Schema<IAlbum>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  coverImageUrl: { type: String, required: true },
  location: { type: String, required: true },
  tags: [{ type: String }],
  photoCount: { type: Number, required: true },
  dateCreated: { type: Date, required: true },
  dateUpdated: { type: Date, default: Date.now },
});

// Add text index for search functionality
AlbumSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  location: 'text',
});

export const Album = mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
