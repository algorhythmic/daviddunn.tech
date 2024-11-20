'use client';

import Image from 'next/image';
import { Camera, MapPin, Calendar } from 'lucide-react';
import type { Photo } from '@/types/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{photo.title}</DialogTitle>
          {photo.description && (
            <DialogDescription>{photo.description}</DialogDescription>
          )}
          <Button
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </DialogHeader>
        
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={photo.url}
            alt={photo.title}
            width={1200}
            height={900}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>

        <div className="grid gap-4 py-4">
          {photo.metadata.camera && (
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4" />
              <span>{photo.metadata.camera.make} {photo.metadata.camera.model}</span>
            </div>
          )}
          
          {photo.metadata.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>
                {photo.metadata.location.name} 
                <span className="text-muted-foreground ml-2">
                  ({photo.metadata.location.latitude}, {photo.metadata.location.longitude})
                </span>
              </span>
            </div>
          )}
          
          {photo.metadata.dateTaken && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(photo.metadata.dateTaken)}</span>
            </div>
          )}

          {photo.metadata.tags && photo.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photo.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
