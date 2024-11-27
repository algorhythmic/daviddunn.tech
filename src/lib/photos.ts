import { connectToDatabase } from '@/lib/mongodb';
import { PhotoModel } from '@/models/photo';
import { revalidatePath } from 'next/cache';
import type { IPhoto } from '@/types/schema';

export async function uploadPhoto(photoData: {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category?: string;
  tags?: string[];
  metadata: {
    width: number;
    height: number;
    camera?: {
      make?: string;
      model?: string;
      settings?: {
        iso?: number;
        aperture?: string;
        shutterSpeed?: string;
        focalLength?: string;
      };
    };
  };
}) {
  await connectToDatabase();
  
  const photoModel = new PhotoModel({
    ...photoData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await photoModel.save();
  revalidatePath('/photos');
  revalidatePath('/admin/photos');
  return photoModel;
}

export async function updatePhoto(id: string, photoData: Partial<IPhoto>) {
  await connectToDatabase();
  
  const photoModel = await PhotoModel.findByIdAndUpdate(
    id,
    {
      ...photoData,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!photoModel) {
    throw new Error('Photo not found');
  }

  revalidatePath('/photos');
  revalidatePath('/admin/photos');
  return photoModel;
}

export async function deletePhoto(id: string) {
  await connectToDatabase();
  
  const photoModel = await PhotoModel.findByIdAndDelete(id);
  
  if (!photoModel) {
    throw new Error('Photo not found');
  }

  revalidatePath('/photos');
  revalidatePath('/admin/photos');
  return photoModel;
}

export async function getAllPhotos() {
  await connectToDatabase();
  return PhotoModel.find().sort({ createdAt: -1 });
}

export async function getPhotoById(id: string) {
  await connectToDatabase();
  const photoModel = await PhotoModel.findById(id);
  
  if (!photoModel) {
    throw new Error('Photo not found');
  }
  
  return photoModel;
}
