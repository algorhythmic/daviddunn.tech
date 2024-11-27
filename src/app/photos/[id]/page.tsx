import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { IPhoto } from '@/types/schema';
import PhotoModel, { IPhotoWithId } from '@/models/photo';
import { ObjectId } from 'mongodb';
import { ChevronLeft, MapPin, Calendar, Tag } from 'lucide-react';
import ImageIcon from '@/components/ImageIcon';

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// This is used to generate the static paths
export async function generateStaticParams() {
  try {
    await connectToDatabase();
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

    await connectToDatabase();
    const photo = await PhotoModel.findById(id).lean();
    
    if (!photo) {
      return null;
    }

    // Type guard to ensure all required properties are present
    const isValidPhoto = (obj: unknown): obj is IPhotoWithId => {
      if (!obj || typeof obj !== 'object') return false;
      const photo = obj as Partial<IPhotoWithId>;
      return (
        photo._id !== undefined &&
        typeof photo.title === 'string' &&
        typeof photo.description === 'string' &&
        typeof photo.s3Key === 'string' &&
        Array.isArray(photo.tags) &&
        photo.dateTaken instanceof Date &&
        photo.dateUploaded instanceof Date
      );
    };

    if (!isValidPhoto(photo)) {
      console.error('Incomplete photo data:', photo);
      return null;
    }

    return {
      ...photo,
      url: photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`,
      width: photo.width ?? 1920,
      height: photo.height ?? 1080,
    };
  } catch (error) {
    console.error('Error fetching photo:', error);
    throw new Error('Failed to fetch photo');
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const photo = await getPhoto(resolvedParams.id);
  if (!photo) return {};

  return {
    title: `${photo.title} | David Dunn`,
    description: photo.description,
  };
}

export default async function PhotoPage({ params }: Props) {
  const resolvedParams = await params;
  const photo = await getPhoto(resolvedParams.id);
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

            {photo.camera && (
              <div className="flex items-center text-gray-600">
                <ImageIcon className="w-5 h-5 mr-2" />
                <span>{photo.camera}</span>
                {photo.lens && (
                  <span className="ml-1">with {photo.lens}</span>
                )}
              </div>
            )}

            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Tag className="w-5 h-5" />
                {photo.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-1 text-sm bg-gray-100 rounded-md"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {(photo.aperture || photo.shutterSpeed || photo.iso || photo.focalLength) && (
              <div className="mt-6 space-y-2">
                <h2 className="text-lg font-semibold">Camera Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {photo.aperture && (
                    <div>
                      <span className="text-gray-500">Aperture</span>
                      <p>ƒ/{photo.aperture}</p>
                    </div>
                  )}
                  {photo.shutterSpeed && (
                    <div>
                      <span className="text-gray-500">Shutter Speed</span>
                      <p>{photo.shutterSpeed}s</p>
                    </div>
                  )}
                  {photo.iso && (
                    <div>
                      <span className="text-gray-500">ISO</span>
                      <p>{photo.iso}</p>
                    </div>
                  )}
                  {photo.focalLength && (
                    <div>
                      <span className="text-gray-500">Focal Length</span>
                      <p>{photo.focalLength}</p>
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
