'use client';

import { useState } from 'react';
import { IPhoto } from '@/types/schema';
import { PhotoGrid } from './photo-grid';
import { PhotoLightbox } from './photo-lightbox';

interface GalleryProps {
  photos: IPhoto[];
}

export function Gallery({ photos }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
  };

  const handleLightboxClose = () => {
    setLightboxIndex(-1);
  };

  return (
    <div>
      <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
      <PhotoLightbox
        photos={photos}
        initialIndex={lightboxIndex}
        isOpen={lightboxIndex !== -1}
        onClose={handleLightboxClose}
      />
    </div>
  );
}
