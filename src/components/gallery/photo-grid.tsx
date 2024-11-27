'use client';

import { useCallback } from 'react';
import PhotoAlbum from 'react-photo-album';
import { Photo } from '@/models/mongodb/Photo';
import Image from 'next/image';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  const renderPhoto = useCallback(({ photo, imageProps: { style } }) => (
    <div
      className="group relative overflow-hidden rounded-md transition-transform hover:scale-[1.02]"
      style={style}
    >
      <Image
        src={photo.src}
        alt={photo.alt || 'Gallery photo'}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        className="rounded transition-transform duration-200 hover:scale-105"
      />
      {photo.title && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-sm font-medium text-white">{photo.title}</p>
        </div>
      )}
    </div>
  ), []);

  const processedPhotos = photos.map(photo => {
    // Log the photo object for debugging
    console.log('Processing photo:', {
      id: photo._id,
      title: photo.title,
      s3Key: photo.s3Key,
      url: photo.url
    });

    // Always use CloudFront URL
    const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    if (!cloudFrontUrl) {
      console.error('NEXT_PUBLIC_CLOUDFRONT_URL is not defined');
      return null;
    }

    // Check for required fields
    if (!photo || typeof photo !== 'object') {
      console.error('Invalid photo object:', photo);
      return null;
    }

    // Use the stored URL from the photo document
    const src = photo.url;
    if (!src) {
      console.error('Photo has no URL:', {
        photoId: photo._id,
        url: photo.url,
        s3Key: photo.s3Key
      });
      return null;
    }

    return {
      src,
      width: photo.width || 1920,
      height: photo.height || 1080,
      alt: photo.title || 'Photo',
      title: photo.title,
      key: photo._id.toString() // Add a key for React
    };
  }).filter(Boolean); // Remove null entries

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
      renderPhoto={renderPhoto}
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
