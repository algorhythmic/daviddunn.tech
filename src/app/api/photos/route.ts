import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import { Photo } from '@/types/schema';
import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema<Photo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  metadata: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    camera: {
      make: String,
      model: String,
      settings: {
        iso: Number,
        aperture: String,
        shutterSpeed: String,
        focalLength: String,
      },
    },
    location: {
      name: String,
      latitude: Number,
      longitude: Number,
    },
    takenAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PhotoModel = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);

export async function GET() {
  try {
    await connectToMongoDB();
    const photos = await PhotoModel.find().sort({ createdAt: -1 });
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
    const photo = await request.json();
    await connectToMongoDB();
    const newPhoto = await PhotoModel.create(photo);
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
