import { Metadata } from 'next';
import AlbumGallery from '@/components/AlbumGallery';
import { testAlbums } from '@/data/testData';

export const metadata: Metadata = {
  title: 'Photo Albums | David Dunn',
  description: 'Browse through my collection of photo albums capturing various moments and subjects.',
};

export default function PhotosPage() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Photo Albums</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore my collection of photographs organized by theme and location.
          </p>
        </div>
        <AlbumGallery initialAlbums={testAlbums} />
      </div>
    </main>
  );
}
