import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import { Photo } from '@/types/schema';
import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema<Photo>({
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
  uploadedAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, {
  timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' }
});

const PhotoModel = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    await connectToMongoDB();
    
    let query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const photos = await PhotoModel.find(query).sort({ uploadedAt: -1 });
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToMongoDB();
    const photo = await PhotoModel.create(body);
    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
