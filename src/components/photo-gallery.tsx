'use client';

import { useCallback, useEffect, useState } from 'react';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import { IPhoto } from '@/models/photo';
import PhotoAlbum from 'react-photo-album';
import type { Photo } from 'react-photo-album';

interface PhotoGalleryProps {
  photos: IPhoto[];
  onPhotoClick?: (photo: IPhoto) => void;
}

export function PhotoGallery({ photos, onPhotoClick }: PhotoGalleryProps) {
  const [photoSwipe, setPhotoSwipe] = useState<PhotoSwipe | null>(null);

  useEffect(() => {
    // Cleanup PhotoSwipe instance on unmount
    return () => {
      if (photoSwipe) {
        photoSwipe.destroy();
      }
    };
  }, [photoSwipe]);

  const openLightbox = useCallback((index: number) => {
    const pswp = new PhotoSwipe({
      dataSource: photos.map(photo => ({
        src: `${process.env.NEXT_PUBLIC_S3_URL}/${photo.s3Key}`,
        width: photo.width ?? photo.metadata?.width ?? 1920,
        height: photo.height ?? photo.metadata?.height ?? 1080,
        alt: photo.title || 'Photo'
      })),
      index,
      pswpModule: PhotoSwipe,
      wheelToZoom: true,
      closeOnVerticalDrag: false,
    });

    pswp.on('close', () => {
      setPhotoSwipe(null);
    });

    pswp.init();
    setPhotoSwipe(pswp);
  }, [photos]);

  const handleClick = useCallback(({ index }: { index: number }) => {
    if (onPhotoClick) {
      onPhotoClick(photos[index]);
    } else {
      openLightbox(index);
    }
  }, [photos, onPhotoClick, openLightbox]);

  const processedPhotos: Photo[] = photos.map(photo => ({
    src: photo.url || `${process.env.NEXT_PUBLIC_S3_URL}/${photo.s3Key}`,
    width: photo.width ?? photo.metadata?.width ?? 1920,
    height: photo.height ?? photo.metadata?.height ?? 1080,
    alt: photo.title || '',
    key: photo._id.toString()
  }));

  return (
    <div className="w-full">
      <PhotoAlbum
        layout="rows"
        photos={processedPhotos}
        onClick={handleClick}
        spacing={16}
        targetRowHeight={300}
      />
    </div>
  );
}
