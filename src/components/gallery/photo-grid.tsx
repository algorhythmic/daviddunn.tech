'use client';

import { useMemo } from 'react';
import PhotoAlbum, { RenderPhotoProps, RenderPhotoContext } from 'react-photo-album';
import { IPhoto } from '@/models/photo';
import Image from 'next/image';

interface PhotoGridProps {
  photos: IPhoto[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  const processedPhotos = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    
    return photos
      .filter((photo): photo is IPhoto => photo !== null)
      .map(photo => ({
        src: photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`,
        width: photo.width ?? photo.metadata?.width ?? 1920,
        height: photo.height ?? photo.metadata?.height ?? 1080,
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
      render={{
        photo: (props: RenderPhotoProps, context: RenderPhotoContext) => (
          <div
            className="group relative overflow-hidden rounded-md transition-transform hover:scale-[1.02]"
          >
            <Image
              src={context.photo.src ?? ''}
              alt={context.photo.alt ?? ''}
              width={context.width ?? 0}
              height={context.height ?? 0}
              onClick={props.onClick} 
            />
            {/* Optional: Add hover effect or additional content */}
          </div>
        )
      }}
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
