import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToMongoDB } from '@/lib/db';
import PhotoModel, { IPhoto } from '@/models/photo';
import { ObjectId } from 'mongodb';
import { ChevronLeft, MapPin, Calendar, Tag } from 'lucide-react';
import ImageIcon from '@/components/ImageIcon';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// This is used to generate the static paths
export async function generateStaticParams() {
  try {
    await connectToMongoDB();
    const photos = await PhotoModel.find().lean().exec();
    return photos.map((photo) => ({
      id: (photo._id as unknown as { toString(): string }).toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getPhoto(id: string): Promise<IPhoto | null> {
  try {
    if (!id || !ObjectId.isValid(id)) {
      throw new Error('Invalid photo ID');
    }

    await connectToMongoDB();
    const photo = await PhotoModel.findById(id).lean();
    
    if (!photo) {
      return null;
    }

    // Type guard to ensure all required properties are present
    const isValidPhoto = (obj: any): obj is IPhoto => {
      return (
        obj._id !== undefined &&
        obj.title !== undefined &&
        obj.description !== undefined &&
        obj.s3Key !== undefined &&
        obj.category !== undefined &&
        obj.tags !== undefined &&
        obj.dateTaken !== undefined &&
        obj.dateUploaded !== undefined
      );
    };

    if (!isValidPhoto(photo)) {
      console.error('Incomplete photo data:', photo);
      return null;
    }

    return {
      ...photo,
      _id: photo._id,
      url: photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`,
      width: photo.width ?? photo.metadata?.width ?? 1920,
      height: photo.height ?? photo.metadata?.height ?? 1080,
    } as IPhoto;
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw new Error('Failed to fetch photo');
  }
}

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const photo = await getPhoto(props.params.id);

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

export default async function PhotoPage(props: Props) {
  const photo = await getPhoto(props.params.id);

  if (!photo) {
    notFound();
  }

  const formattedDate = new Date(photo.dateTaken).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageUrl = photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/photos"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Photos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={photo.title}
            fill
            className="object-cover rounded-lg shadow-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{photo.title}</h1>
          <p className="text-gray-600 mb-6">{photo.description}</p>

          <div className="space-y-4">
            {photo.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{photo.location}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{formattedDate}</span>
            </div>

            {photo.metadata?.camera && (
              <div className="flex items-center text-gray-600">
                <ImageIcon className="w-5 h-5 mr-2" />
                <span>{photo.metadata.camera}</span>
                {photo.metadata.lens && (
                  <span className="ml-1">with {photo.metadata.lens}</span>
                )}
              </div>
            )}

            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center text-sm bg-gray-100 rounded-full px-3 py-1"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {photo.metadata?.settings && (
              <div className="mt-6 space-y-2">
                <h2 className="text-lg font-semibold">Camera Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {photo.metadata.settings.aperture && (
                    <div>
                      <span className="text-gray-500">Aperture</span>
                      <p>ƒ/{photo.metadata.settings.aperture}</p>
                    </div>
                  )}
                  {photo.metadata.settings.shutterSpeed && (
                    <div>
                      <span className="text-gray-500">Shutter Speed</span>
                      <p>{photo.metadata.settings.shutterSpeed}s</p>
                    </div>
                  )}
                  {photo.metadata.settings.iso && (
                    <div>
                      <span className="text-gray-500">ISO</span>
                      <p>{photo.metadata.settings.iso}</p>
                    </div>
                  )}
                  {photo.metadata.settings.focalLength && (
                    <div>
                      <span className="text-gray-500">Focal Length</span>
                      <p>{photo.metadata.settings.focalLength}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
