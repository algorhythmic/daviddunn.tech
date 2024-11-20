import { Suspense } from 'react';
import { mockPhotos } from '@/data/mockPhotos';
import PhotoCard from '@/components/PhotoCard';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingPhotos() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PhotoGallery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">Photo Gallery</h1>
        <p className="text-lg text-muted-foreground">
          A collection of my favorite photographs from around the world.
        </p>
      </div>
      
      <Suspense fallback={<LoadingPhotos />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPhotos.map((photo) => (
            <PhotoCard key={photo._id} photo={photo} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
