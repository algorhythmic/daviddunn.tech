'use client';

import { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar } from 'lucide-react';
import { IPhoto } from '@/types/schema';
import Image from 'next/image';
import PhotoModal from './PhotoModal';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PhotoCardProps {
  photo: IPhoto;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Validate photo and environment variables
    if (!photo?.s3Key) {
      console.error('Photo has no s3Key:', photo);
      return;
    }

    const cloudFrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
    if (!cloudFrontUrl) {
      console.error('NEXT_PUBLIC_CLOUDFRONT_URL is not defined');
      return;
    }

    // Set the image URL
    const url = photo.url || `${cloudFrontUrl}/${photo.s3Key}`;
    setImageUrl(url);

    // Set image dimensions
    const width = photo.width ?? 1920;
    const height = photo.height ?? 1080;
    setImageDimensions({ width, height });
  }, [photo]);

  // Return null if we don't have a valid image URL
  if (!imageUrl) {
    return null;
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card className="group overflow-hidden">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button 
              className="relative cursor-pointer w-full text-left border-0 bg-transparent p-0"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <Image
                  src={imageUrl}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-10" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{photo.title}</h4>
              <p className="text-sm text-muted-foreground">{photo.description}</p>
              {photo.camera && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Camera className="h-4 w-4" />
                  <span>{String(photo.camera)}</span>
                </div>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>

        <CardHeader>
          <CardTitle className="text-lg">{photo.title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">{photo.description}</p>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-2">
          <TooltipProvider>
            {photo.location && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{photo.location}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Location: {photo.location}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="truncate">{formatDate(photo.dateTaken)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Date taken: {formatDate(photo.dateTaken)}</p>
              </TooltipContent>
            </Tooltip>

            {photo.camera && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Camera className="h-4 w-4" />
                    <span className="truncate">{String(photo.camera)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Camera: {String(photo.camera)}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </CardFooter>
      </Card>

      {isModalOpen && imageDimensions && (
        <PhotoModal 
          photo={{
            _id: photo._id?.toString(),
            title: photo.title,
            description: photo.description,
            url: imageUrl,
            s3Key: photo.s3Key,
            thumbnailUrl: imageUrl,
            category: photo.category,
            camera: photo.camera,
            lens: photo.lens,
            tags: photo.tags,
            location: photo.location,
            dateTaken: photo.dateTaken,
            dateUploaded: photo.dateUploaded,
            width: imageDimensions.width,
            height: imageDimensions.height,
            aperture: photo.aperture,
            shutterSpeed: photo.shutterSpeed,
            iso: photo.iso,
            focalLength: photo.focalLength,
            latitude: photo.latitude,
            longitude: photo.longitude
          }}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
}
