'use client';

import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { IPhoto } from '@/types/schema';

interface PhotoModalPhoto {
  src?: string;
  url?: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
}

interface PhotoModalProps {
  photo?: IPhoto;
  photos?: IPhoto[];
  index?: number;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function PhotoModal({ photo, photos, index = 0, onClose, isOpen = true }: PhotoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    
    // Convert schema photos to PhotoSwipe format
    const convertToPhotoSwipe = (p: IPhoto): PhotoModalPhoto => ({
      src: p.url,
      url: p.url,
      title: p.title,
      description: p.description,
    });
    
    // Convert single photo to array if needed
    const photoArray = photo ? [convertToPhotoSwipe(photo)] : photos?.map(convertToPhotoSwipe) || [];
    
    const lightbox = new PhotoSwipeLightbox({
      dataSource: photoArray.map(p => ({
        src: p.src || p.url || '',
        // Use default dimensions if not provided
        width: p.width || 1920,
        height: p.height || 1080,
        alt: p.title || '',
        title: p.description || p.title || '',
      })),
      pswpModule: () => import('photoswipe'),
      index: index,
      closeOnVerticalDrag: true,
      wheelToZoom: true,
    });

    lightbox.on('close', () => {
      onClose?.();
    });

    lightbox.init();
    lightbox.loadAndOpen(index);

    return () => {
      lightbox.destroy();
    };
  }, [photo, photos, index, onClose, isOpen]);

  return null;
}
