'use client';

import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface Photo {
  src?: string;
  url?: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
}

interface PhotoModalProps {
  photo?: Photo;
  photos?: Photo[];
  index?: number;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function PhotoModal({ photo, photos, index = 0, onClose, isOpen = true }: PhotoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    
    // Convert single photo to array if needed
    const photoArray = photo ? [photo] : photos || [];
    
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
