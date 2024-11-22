import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { connectToMongoDB } from '@/lib/db';
import { Photo } from '@/models/photo';
import { IPhoto } from '@/models/photo';

export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: {
    id: string;
  };
}

interface PhotoDocument extends IPhoto {
  _id: ObjectId;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const photo = await getPhoto(params.id);
  
  if (!photo) {
    return {
      title: 'Photo Not Found | David Dunn',
      description: 'The requested photo could not be found.',
    };
  }
  
  return {
    title: `${photo.title} | David Dunn Photography`,
    description: photo.description,
    openGraph: {
      images: [photo.imageUrl],
    },
  };
}

async function getPhoto(id: string): Promise<PhotoDocument | null> {
  try {
    if (!ObjectId.isValid(id)) return null;
    
    await connectToMongoDB();
    const photo = await Photo.findById(id).lean<PhotoDocument>();
    return photo;
  } catch (error) {
    console.error('Error fetching photo:', error);
    return null;
  }
}

async function getRelatedPhotos(currentPhoto: PhotoDocument): Promise<PhotoDocument[]> {
  try {
    await connectToMongoDB();
    const relatedPhotos = await Photo.find({
      _id: { $ne: currentPhoto._id },
      $or: [
        { category: currentPhoto.category },
        { tags: { $in: currentPhoto.tags } },
      ],
    })
      .limit(3)
      .sort({ dateTaken: -1 })
      .lean<PhotoDocument[]>();
    
    return relatedPhotos;
  } catch (error) {
    console.error('Error fetching related photos:', error);
    return [];
  }
}

export default async function PhotoPage({ params }: Props) {
  const photo = await getPhoto(params.id);
  
  if (!photo) {
    notFound();
  }
  
  const relatedPhotos = await getRelatedPhotos(photo);
  
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-8">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/photos">Photos</Link></li>
          <li><Link href={`/photos?category=${photo.category}`}>{photo.category}</Link></li>
          <li>{photo.title}</li>
        </ul>
      </div>
      
      {/* Photo Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo */}
        <div className="relative">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{photo.title}</h1>
          <p className="text-gray-600 mb-6">{photo.description}</p>
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700">Date Taken</h3>
              <p>{new Date(photo.dateTaken).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Category</h3>
              <p>{photo.category}</p>
            </div>
            {photo.location && (
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p>{photo.location}</p>
              </div>
            )}
          </div>
          
          {/* Camera Settings */}
          {photo.metadata && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Camera Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                {photo.metadata.camera && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Camera</h3>
                    <p>{photo.metadata.camera}</p>
                  </div>
                )}
                {photo.metadata.lens && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Lens</h3>
                    <p>{photo.metadata.lens}</p>
                  </div>
                )}
                {photo.metadata.settings?.aperture && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Aperture</h3>
                    <p>f/{photo.metadata.settings.aperture}</p>
                  </div>
                )}
                {photo.metadata.settings?.shutterSpeed && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Shutter Speed</h3>
                    <p>{photo.metadata.settings.shutterSpeed}s</p>
                  </div>
                )}
                {photo.metadata.settings?.iso && (
                  <div>
                    <h3 className="font-semibold text-gray-700">ISO</h3>
                    <p>{photo.metadata.settings.iso}</p>
                  </div>
                )}
                {photo.metadata.settings?.focalLength && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Focal Length</h3>
                    <p>{photo.metadata.settings.focalLength}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {photo.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/photos?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Photos */}
      {relatedPhotos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPhotos.map((relatedPhoto) => (
              <Link
                key={relatedPhoto._id.toString()}
                href={`/photos/${relatedPhoto._id}`}
                className="block group"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={relatedPhoto.imageUrl}
                    alt={relatedPhoto.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="mt-2 font-semibold group-hover:text-blue-600">
                  {relatedPhoto.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
