'use client';

import { useCallback, useEffect, useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import { Photo } from '@/models/mongodb/Photo';
import Image from "next/image";

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
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
        width: 1920, // Default width, will be adjusted by PhotoSwipe
        height: 1080, // Default height, will be adjusted by PhotoSwipe
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

  const renderPhoto = useCallback(({ photo, imageProps: { alt, style, ...rest } }) => (
    <div
      style={{
        borderRadius: '4px',
        overflow: 'hidden',
        ...style
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt || "Gallery photo"}
        width={photo.width || 800}
        height={photo.height || 600}
        className="object-cover w-full h-full rounded-lg"
      />
    </div>
  ), []);

  return (
    <PhotoAlbum
      layout="masonry"
      photos={photos.map(photo => ({
        src: `${process.env.NEXT_PUBLIC_S3_URL}/${photo.s3Key}`,
        width: 1920, // Default width, will be adjusted by PhotoSwipe
        height: 1080, // Default height, will be adjusted by PhotoSwipe
        alt: photo.title || 'Photo',
        title: photo.title
      }))}
      onClick={handleClick}
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
