import type { IPhoto } from '@/types/schema';

export async function getPhotos(): Promise<IPhoto[]> {
  const response = await fetch('/api/photos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }

  return response.json();
}

export async function getPhotosByCategory(category: string): Promise<IPhoto[]> {
  const response = await fetch(`/api/photos?category=${encodeURIComponent(category)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch photos by category');
  }

  return response.json();
}

export async function searchPhotos(query: string): Promise<IPhoto[]> {
  const response = await fetch(`/api/photos?search=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search photos');
  }

  return response.json();
}
