import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { connectToMongoDB } from '@/lib/db';
import { Album, IAlbum } from '@/models/album';
import { ObjectId } from 'mongodb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Photo Albums | David Dunn',
  description: 'Browse through my collection of photo albums capturing various adventures and moments.',
};

export const revalidate = 3600; // Revalidate every hour

async function getAlbums() {
  try {
    await connectToMongoDB();
    const rawAlbums = await Album.find()
      .sort({ dateCreated: -1 })
      .lean();

    const albums = rawAlbums.map(album => ({
      _id: album._id instanceof ObjectId ? album._id : new ObjectId(album._id as string),
      title: album.title,
      description: album.description,
      coverImageUrl: album.coverImageUrl,
      location: album.location,
      tags: album.tags || [],
      photoCount: album.photoCount,
      dateCreated: new Date(album.dateCreated),
      dateUpdated: new Date(album.dateUpdated)
    } satisfies IAlbum));

    if (albums.length === 0) {
      // Add test data if no albums exist
      const testAlbums = [
        {
          _id: new ObjectId(),
          title: 'Japan Adventure 2023',
          description: 'Exploring the vibrant streets of Tokyo and serene temples of Kyoto',
          coverImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
          location: 'Japan',
          tags: ['Travel', 'Culture', 'Architecture'],
          photoCount: 42,
          dateCreated: new Date('2023-11-01'),
          dateUpdated: new Date('2023-11-01'),
        },
        {
          _id: new ObjectId(),
          title: 'California Coast',
          description: 'A road trip along the Pacific Coast Highway, from San Francisco to Los Angeles',
          coverImageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
          location: 'California, USA',
          tags: ['Nature', 'Landscape', 'Ocean'],
          photoCount: 28,
          dateCreated: new Date('2023-09-15'),
          dateUpdated: new Date('2023-09-15'),
        },
        {
          _id: new ObjectId(),
          title: 'Urban Photography',
          description: 'Street photography capturing the essence of city life',
          coverImageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
          location: 'New York City, USA',
          tags: ['Urban', 'Street', 'Black and White'],
          photoCount: 35,
          dateCreated: new Date('2023-10-01'),
          dateUpdated: new Date('2023-10-01'),
        },
        {
          _id: new ObjectId(),
          title: 'Mountain Escapes',
          description: 'Adventures in the Rocky Mountains during all seasons',
          coverImageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
          location: 'Colorado, USA',
          tags: ['Nature', 'Mountains', 'Adventure'],
          photoCount: 56,
          dateCreated: new Date('2023-08-20'),
          dateUpdated: new Date('2023-08-20'),
        },
      ];

      await Album.insertMany(testAlbums);
      return testAlbums as IAlbum[];
    }
      
    return albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw new Error('Failed to fetch albums');
  }
}

export default async function PhotosPage() {
  const albums = await getAlbums();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Photo Albums</h1>
          <p className="text-muted-foreground">
            Explore collections of photographs from my adventures around the world.
          </p>
        </div>
        
        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {albums.map((album) => (
            <Link 
              key={album._id.toString()} 
              href={`/photos/albums/${album._id}`}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="relative aspect-[2/1] w-full">
                    <Image
                      src={album.coverImageUrl}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{album.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      <span>{album.photoCount} photos</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{album.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {album.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {album.tags.map((tag: string) => (
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
        
        {albums.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No albums found</h3>
            <p className="text-muted-foreground">Check back later for new photo albums.</p>
          </div>
        )}
      </div>
    </main>
  );
}
