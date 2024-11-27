import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToMongoDB } from '@/lib/db';
import Photo from '@/models/mongodb/Photo';
import { ObjectId } from 'mongodb';
import { ChevronLeft, MapPin, Calendar, Tag } from 'lucide-react';
import ImageIcon from '@/components/ImageIcon';

interface Props {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// This is used to generate the static paths
export async function generateStaticParams() {
  try {
    await connectToMongoDB();
    const photos = await Photo.find().lean();
    return photos.map((photo) => ({
      id: photo._id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getPhoto(id: string) {
  try {
    if (!id || !ObjectId.isValid(id)) {
      throw new Error('Invalid photo ID');
    }

    await connectToMongoDB();
    
    const photo = await Photo.findById(id).lean();
    if (!photo) {
      return null;
    }

    // Ensure we have a valid URL
    const url = photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`;

    return {
      ...photo,
      _id: photo._id.toString(),
      title: photo.title || 'Untitled',
      description: photo.description || '',
      url,
      s3Key: photo.s3Key,
      tags: photo.tags || [],
      metadata: photo.metadata || {},
      dateCreated: new Date(photo.dateCreated),
      dateUpdated: new Date(photo.dateUpdated)
    };
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw new Error('Failed to fetch photo');
  }
}

export async function generateMetadata(
  props: Props,
): Promise<Metadata> {
  const params = await props.params;
  const photo = await getPhoto(params.id);

  if (!photo) {
    return {
      title: 'Photo Not Found | David Dunn',
      description: 'The requested photo could not be found.',
    };
  }

  return {
    title: `${photo.title} | David Dunn`,
    description: photo.description || 'View this photo in my collection.',
  };
}

export default async function PhotoPage({
  params: paramsPromise,
}: {
  params: {
    id: string;
  };
}) {
  const params = await paramsPromise;
  const photo = await getPhoto(params.id);

  if (!photo) {
    notFound();
  }

  const formattedDate = new Date(photo.dateCreated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button and header */}
        <div className="mb-8">
          <Link 
            href="/photos" 
            className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Photos
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">{photo.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            {photo.metadata?.location?.name && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{photo.metadata.location.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {photo.description && (
            <p className="text-lg text-muted-foreground mb-4">{photo.description}</p>
          )}

          {photo.tags && photo.tags.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <div className="flex flex-wrap gap-2">
                {photo.tags.map(tag => (
                  <span key={tag} className="text-sm">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photo display */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
          {photo.url ? (
            <Image
              src={photo.url}
              alt={photo.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <ImageIcon className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Metadata */}
        {photo.metadata && (
          <div className="mt-8 space-y-4 text-sm text-muted-foreground">
            {photo.metadata.camera?.make && photo.metadata.camera?.model && (
              <div>
                <strong>Camera:</strong> {photo.metadata.camera.make} {photo.metadata.camera.model}
              </div>
            )}
            {photo.metadata.camera?.settings && (
              <div className="space-y-2">
                <strong>Settings:</strong>
                <ul className="list-disc list-inside pl-4">
                  {photo.metadata.camera.settings.iso && (
                    <li>ISO: {photo.metadata.camera.settings.iso}</li>
                  )}
                  {photo.metadata.camera.settings.aperture && (
                    <li>Aperture: {photo.metadata.camera.settings.aperture}</li>
                  )}
                  {photo.metadata.camera.settings.shutterSpeed && (
                    <li>Shutter Speed: {photo.metadata.camera.settings.shutterSpeed}</li>
                  )}
                  {photo.metadata.camera.settings.focalLength && (
                    <li>Focal Length: {photo.metadata.camera.settings.focalLength}</li>
                  )}
                </ul>
              </div>
            )}
            {photo.metadata.takenAt && (
              <div>
                <strong>Taken:</strong> {new Date(photo.metadata.takenAt).toLocaleString()}
              </div>
            )}
            {photo.metadata.location?.latitude && photo.metadata.location?.longitude && (
              <div>
                <strong>Location:</strong> {photo.metadata.location.latitude}, {photo.metadata.location.longitude}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
