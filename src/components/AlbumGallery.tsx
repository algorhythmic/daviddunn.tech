'use client';

import { useState } from 'react';
import AlbumCard from './AlbumCard';
import { Album } from '@/types/schema';

interface AlbumGalleryProps {
  initialAlbums: Album[];
}

export default function AlbumGallery({ initialAlbums }: AlbumGalleryProps) {
  const [albums] = useState<Album[]>(initialAlbums);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <AlbumCard key={album._id} album={album} />
        ))}
      </div>
    </div>
  );
}
