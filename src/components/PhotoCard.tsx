'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Calendar, Tag } from 'lucide-react';
import type { Photo } from '@/types/schema';
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
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
            <div 
              className="relative cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  width={500}
                  height={375}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-10" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{photo.title}</h4>
              <p className="text-sm text-muted-foreground">{photo.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Camera className="h-4 w-4" />
                <span>{photo.metadata.camera?.make} {photo.metadata.camera?.model}</span>
              </div>
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
            {photo.metadata.location && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{photo.metadata.location.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Location: {photo.metadata.location.name}</p>
                  <p className="text-xs">
                    {photo.metadata.location.latitude}, {photo.metadata.location.longitude}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {photo.metadata.dateTaken && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="truncate">{formatDate(photo.metadata.dateTaken)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Date taken: {formatDate(photo.metadata.dateTaken)}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </CardFooter>
      </Card>

      {isModalOpen && (
        <PhotoModal
          photo={photo}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
