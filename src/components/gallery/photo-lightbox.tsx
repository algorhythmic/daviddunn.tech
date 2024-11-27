'use client';

import { useEffect, useState } from 'react';
import 'photoswipe/style.css';
import { Photo } from '@/models/mongodb/Photo';
import PhotoSwipe from 'photoswipe';

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, isOpen, onClose }: PhotoLightboxProps) {
  const [photoSwipe, setPhotoSwipe] = useState<PhotoSwipe | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (!photoSwipe) return;
    
    const handleClose = () => {
      if (onClose) onClose();
    };

    photoSwipe.on('close', handleClose);
    
    return () => {
      photoSwipe.off('close', handleClose);
    };
  }, [photoSwipe, onClose]);

  useEffect(() => {
    if (!photoSwipe) return;
    
    const handleIndexChange = () => {
      setCurrentIndex(photoSwipe.currIndex);
    };

    photoSwipe.on('change', handleIndexChange);

    return () => {
      photoSwipe.off('change', handleIndexChange);
    };
  }, [photoSwipe, setCurrentIndex]);

  useEffect(() => {
    if (!isOpen) {
      if (photoSwipe) {
        photoSwipe.destroy();
        setPhotoSwipe(null);
      }
      return;
    }

    const options = {
      index: currentIndex,
      dataSource: photos.map((photo) => ({
        src: `${process.env.NEXT_PUBLIC_S3_URL}/${photo.s3Key}`,
        w: 1920,
        h: 1080,
        alt: photo.title || 'Photo',
      })),
      wheelToZoom: true,
      closeOnVerticalDrag: false,
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      bgOpacity: 0.9,
      showHideAnimationType: 'fade' as 'fade'
    };

    const pswp = new PhotoSwipe(options);
    setPhotoSwipe(pswp);
    pswp.init();
  }, [isOpen, photos, currentIndex, photoSwipe]);

  return null;
}
