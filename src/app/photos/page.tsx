import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { connectToMongoDB } from '@/lib/db';
import Photo, { IPhoto } from '@/models/mongodb/Photo';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Image as ImageIcon, Calendar } from 'lucide-react';
import { ObjectId } from 'mongodb';
import type { Photo as PhotoType } from '@/types/schema';

export const metadata: Metadata = {
  title: 'Photos | David Dunn',
  description: 'Browse through my collection of photos capturing various adventures and moments.',
};

export const revalidate = 3600; // Revalidate every hour

async function getPhotos(): Promise<PhotoType[]> {
  try {
    await connectToMongoDB();
    const rawPhotos = await Photo.find()
      .sort({ dateCreated: -1 })
      .lean();

    // First cast to unknown, then to our specific type
    const photos = (rawPhotos as unknown) as (IPhoto & { _id: ObjectId })[];
    
    return photos.map(photo => {
      // Ensure we have a valid URL
      const url = photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`;
      
      // Ensure metadata.dateTaken is always defined
      const metadata = {
        dateTaken: photo.metadata?.dateTaken || photo.dateCreated,
        camera: photo.metadata?.camera,
        lens: photo.metadata?.lens,
        location: photo.metadata?.location,
        settings: photo.metadata?.settings
      };
      
      return {
        _id: photo._id.toString(),
        title: photo.title || 'Untitled',
        description: photo.description || '',
        url,
        thumbnailUrl: url,
        category: 'uncategorized',
        tags: photo.tags || [],
        metadata,
        dateCreated: photo.dateCreated,
        dateUpdated: photo.dateUpdated
      };
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw new Error('Failed to fetch photos');
  }
}

export default async function PhotosPage() {
  const photos = await getPhotos();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Photos</h1>
          <p className="text-muted-foreground">
            A collection of photographs from my adventures around the world.
          </p>
        </div>
        
        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Link 
              key={photo._id} 
              href={`/photos/${photo._id}`}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] w-full">
                    {photo.url ? (
                      <Image
                        src={photo.url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    {photo.metadata.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{photo.metadata.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(photo.dateCreated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{photo.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {photo.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {photos.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No photos found</h3>
            <p className="text-muted-foreground">Check back later for new photos.</p>
          </div>
        )}
      </div>
    </main>
  );
}
