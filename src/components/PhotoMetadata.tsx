import React from 'react';
import { Camera, MapPin, Calendar, Aperture, Timer, Gauge, Ruler } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PhotoData {
  metadata?: {
    dateTaken: string;
    camera?: string;
    lens?: string;
    location?: string;
    settings?: {
      aperture?: string;
      shutterSpeed?: string;
      iso?: number;
      focalLength?: string;
    };
  };
  location?: string;
  dateTaken?: string;
}

interface PhotoMetadataProps {
  photo: PhotoData;
}

export const PhotoMetadata: React.FC<PhotoMetadataProps> = ({ photo }) => {
  const metadata = photo.metadata;
  
  if (!metadata && !photo.location && !photo.dateTaken) {
    return null;
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Unknown';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <Card className="w-full md:w-96">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Photo Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Info */}
        {(metadata?.camera || metadata?.lens) && (
          <div className="space-y-2">
            {metadata.camera && (
              <div className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4" />
                <span>{metadata.camera}</span>
              </div>
            )}
            {metadata.lens && (
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="h-4 w-4" />
                <span>{metadata.lens}</span>
              </div>
            )}
          </div>
        )}

        {/* Camera Settings */}
        {metadata?.settings && (
          <div className="space-y-2">
            {metadata.settings.aperture && (
              <div className="flex items-center gap-2 text-sm">
                <Aperture className="h-4 w-4" />
                <span>{metadata.settings.aperture}</span>
              </div>
            )}
            {metadata.settings.shutterSpeed && (
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4" />
                <span>{metadata.settings.shutterSpeed}</span>
              </div>
            )}
            {metadata.settings.iso && (
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4" />
                <span>ISO {metadata.settings.iso}</span>
              </div>
            )}
            {metadata.settings.focalLength && (
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="h-4 w-4" />
                <span>{metadata.settings.focalLength}</span>
              </div>
            )}
          </div>
        )}

        {/* Location and Date */}
        <div className="space-y-2">
          {(metadata?.location || photo.location) && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{metadata?.location || photo.location}</span>
            </div>
          )}
          {(metadata?.dateTaken || photo.dateTaken) && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(metadata?.dateTaken || photo.dateTaken)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
