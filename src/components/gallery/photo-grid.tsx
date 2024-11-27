'use client';

import { useMemo } from 'react';
import PhotoAlbum, { RenderPhotoProps } from 'react-photo-album';
import { Photo } from '@/types/schema';
import Image from 'next/image';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  const processedPhotos = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    
    return photos
      .filter((photo): photo is Photo => photo !== null)
      .map(photo => ({
        src: photo.url,
        width: photo.metadata?.width ?? 800,  
        height: photo.metadata?.height ?? 600,  
        alt: photo.title,
        title: photo.title,
        key: photo._id.toString(),
        description: photo.description,
        location: photo.location
      }));
  }, [photos]);

  if (!photos || photos.length === 0 || processedPhotos.length === 0) {
    console.log('No photos available:', {
      photosLength: photos?.length,
      processedPhotosLength: processedPhotos.length
    });
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No photos available.</p>
      </div>
    );
  }

  return (
    <PhotoAlbum
      layout="masonry"
      photos={processedPhotos}
      onClick={({ index }) => onPhotoClick(index)}
      renderPhoto={({ photo, imageProps }: RenderPhotoProps<Photo>) => (
        <div
          className="group relative overflow-hidden rounded-md transition-transform hover:scale-[1.02]"
          style={imageProps.style}
        >
          <Image
            {...imageProps}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
          />
          {/* Optional: Add hover effect or additional content */}
        </div>
      )}
      spacing={8}
      columns={(containerWidth) => {
        if (containerWidth < 640) return 1;
        if (containerWidth < 768) return 2;
        if (containerWidth < 1024) return 3;
        return 4;
      }}
    />
  );
}
