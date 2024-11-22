import { connectToDatabase } from '@/lib/mongodb';
import { Photo } from '@/models/Photo';
import { revalidatePath } from 'next/cache';

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
  
  const photo = new Photo({
    ...photoData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await photo.save();
  revalidatePath('/photos');
  revalidatePath('/admin/photos');
  return photo;
}

export async function updatePhoto(id: string, photoData: Partial<typeof Photo>) {
  await connectToDatabase();
  
  const photo = await Photo.findByIdAndUpdate(
    id,
    {
      ...photoData,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!photo) {
    throw new Error('Photo not found');
  }

  revalidatePath('/photos');
  revalidatePath('/admin/photos');
  return photo;
}

export async function deletePhoto(id: string) {
  await connectToDatabase();
  
  const photo = await Photo.findByIdAndDelete(id);
  
  if (!photo) {
    throw new Error('Photo not found');
  }

  revalidatePath('/photos');
  revalidatePath('/admin/photos');
  return photo;
}

export async function getAllPhotos() {
  await connectToDatabase();
  return Photo.find().sort({ createdAt: -1 });
}

export async function getPhotoById(id: string) {
  await connectToDatabase();
  const photo = await Photo.findById(id);
  
  if (!photo) {
    throw new Error('Photo not found');
  }
  
  return photo;
}
