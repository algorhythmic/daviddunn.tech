'use client';

import { useEffect, useState } from 'react';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import { Photo } from '@/models/mongodb/Photo';

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, isOpen, onClose }: PhotoLightboxProps) {
  const [photoSwipe, setPhotoSwipe] = useState<PhotoSwipe | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (photoSwipe) {
        photoSwipe.destroy();
        setPhotoSwipe(null);
      }
      return;
    }

    const pswp = new PhotoSwipe({
      dataSource: photos.map(photo => ({
        src: `${process.env.NEXT_PUBLIC_S3_URL}/${photo.s3Key}`,
        width: 1920,
        height: 1080,
        alt: photo.title || 'Photo',
        description: photo.description || undefined
      })),
      index: initialIndex,
      wheelToZoom: true,
      closeOnVerticalDrag: false,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      bgOpacity: 0.9,
      showHideAnimationType: 'fade'
    });

    pswp.on('close', () => {
      onClose();
    });

    pswp.init();
    setPhotoSwipe(pswp);

    return () => {
      pswp.destroy();
    };
  }, [photos, initialIndex, isOpen, onClose]);

  return null;
}
