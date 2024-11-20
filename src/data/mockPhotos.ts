import { Photo } from '@/types/schema';

export const mockPhotos: Photo[] = [
  {
    _id: '1',
    title: 'Mountain Landscape',
    description: 'Scenic mountain view at sunset',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    metadata: {
      width: 1920,
      height: 1080,
      dateTaken: '2023-01-15T10:30:00Z',
      camera: {
        make: 'Canon',
        model: 'EOS R5',
      },
      location: {
        name: 'Swiss Alps',
        latitude: 46.8182,
        longitude: 8.2275
      },
      tags: ['mountains', 'sunset', 'landscape']
    }
  },
  {
    _id: '2',
    title: 'Ocean Waves',
    description: 'Powerful waves crashing on rocky shore',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500',
    metadata: {
      width: 1920,
      height: 1080,
      dateTaken: '2023-02-20T15:45:00Z',
      camera: {
        make: 'Sony',
        model: 'A7 IV',
      },
      location: {
        name: 'Big Sur, California',
        latitude: 36.2704,
        longitude: -121.8081
      },
      tags: ['ocean', 'waves', 'nature']
    }
  },
  {
    _id: '3',
    title: 'Forest Path',
    description: 'Misty morning in the redwood forest',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    metadata: {
      width: 1920,
      height: 1080,
      dateTaken: '2023-03-10T08:15:00Z',
      camera: {
        make: 'Fujifilm',
        model: 'X-T4',
      },
      location: {
        name: 'Redwood National Park',
        latitude: 41.2132,
        longitude: -124.0046
      },
      tags: ['forest', 'nature', 'mist']
    }
  },
  {
    _id: '4',
    title: 'Desert Sunset',
    description: 'Golden hour in the Sahara Desert',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500',
    metadata: {
      width: 1920,
      height: 1080,
      dateTaken: '2023-04-05T17:30:00Z',
      camera: {
        make: 'Nikon',
        model: 'Z6 II',
      },
      location: {
        name: 'Sahara Desert, Morocco',
        latitude: 31.7917,
        longitude: -7.0926
      },
      tags: ['desert', 'sunset', 'landscape']
    }
  }
];
