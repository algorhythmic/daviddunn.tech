import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { PhotoMetadata } from '@/components/PhotoMetadata';
import { PhotoActions } from '@/components/PhotoActions';

interface PhotoDocument {
  _id: ObjectId;
  title: string;
  description?: string;
  url?: string;
  s3Key: string;
  thumbnailUrl?: string;
  category?: string;
  camera?: string;
  lens?: string;
  tags?: string[];
  location?: string;
  dateTaken: Date;
  dateUploaded: Date;
  width?: number;
  height?: number;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: string;
  metadata?: {
    dateTaken?: Date;
  };
}

interface PhotoData {
  _id: string;
  title: string;
  description?: string;
  url: string;
  s3Key: string;
  thumbnailUrl?: string;
  category?: string;
  camera?: string;
  lens?: string;
  tags?: string[];
  location?: string;
  dateTaken?: string;
  dateUploaded: string;
  width?: number;
  height?: number;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  focalLength?: string;
  metadata?: {
    dateTaken: string;
  };
}

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    if (!ObjectId.isValid(params.slug)) {
      return {
        title: 'Photo Not Found',
        description: 'The requested photo could not be found.',
      };
    }

    const db = await connectToDatabase();
    const photos = db.connection.db.collection<PhotoDocument>('photos');
    const photo = await photos.findOne(
      { _id: new ObjectId(params.slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (!photo) {
      return {
        title: 'Photo Not Found',
        description: 'The requested photo could not be found.',
      };
    }

    return {
      title: photo.title || 'Photo',
      description: photo.description || 'View this photo on David Dunn\'s photography portfolio.',
      openGraph: {
        images: [photo.thumbnailUrl || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the photo.',
    };
  }
}

export default async function PhotoPage({ params }: Props) {
  try {
    if (!ObjectId.isValid(params.slug)) {
      notFound();
    }

    const db = await connectToDatabase();
    const photos = db.connection.db.collection<PhotoDocument>('photos');
    const photo = await photos.findOne(
      { _id: new ObjectId(params.slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (!photo) {
      notFound();
    }

    const photoData: PhotoData = {
      ...photo,
      _id: photo._id.toString(),
      url: photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`,
      dateTaken: photo.dateTaken ? photo.dateTaken.toISOString() : undefined,
      dateUploaded: photo.dateUploaded ? photo.dateUploaded.toISOString() : new Date().toISOString(),
      metadata: {
        ...photo.metadata,
        dateTaken: photo.metadata?.dateTaken ? photo.metadata.dateTaken.toISOString() : new Date().toISOString()
      }
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-[3/2] w-full mb-8">
            <Image
              src={photoData.url}
              alt={photoData.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
              className="object-contain"
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <PhotoMetadata photo={photoData} />
            <PhotoActions photo={photoData} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading photo:', error);
    throw error;
  }
}
