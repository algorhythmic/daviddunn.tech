'use client';

import { useCallback } from 'react';
import PhotoAlbum from 'react-photo-album';
import { Photo } from '@/models/mongodb/Photo';
import Image from "next/image";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  const renderPhoto = useCallback(({ photo, imageProps: { alt, style, ...rest } }) => (
    <div
      className="group relative overflow-hidden rounded-md transition-transform hover:scale-[1.02]"
      style={style}
    >
      <Image
        src={photo.src}
        alt={photo.alt || "Gallery photo"}
        width={photo.width || 300}
        height={photo.height || 200}
        className="object-cover w-full h-full rounded transition-transform duration-200 hover:scale-105"
      />
      {photo.title && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <p className="text-sm font-medium text-white">{photo.title}</p>
        </div>
      )}
    </div>
  ), []);

  return (
    <PhotoAlbum
      layout="masonry"
      photos={photos.map(photo => ({
        src: `${process.env.NEXT_PUBLIC_S3_URL}/${photo.s3Key}`,
        width: 1920,
        height: 1080,
        alt: photo.title || 'Photo',
        title: photo.title
      }))}
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
