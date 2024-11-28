'use client';

import React from 'react';
import { Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

interface PhotoData {
  _id: string;
  title: string;
  url: string;
}

interface PhotoActionsProps {
  photo: PhotoData;
}

export const PhotoActions: React.FC<PhotoActionsProps> = ({ photo }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photo.title}.jpg`; // You might want to get the actual extension from the URL
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Success',
        description: 'Photo downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading photo:', error);
      toast({
        title: 'Error',
        description: 'Failed to download photo',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: photo.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Success',
          description: 'Link copied to clipboard',
        });
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      toast({
        title: 'Error',
        description: 'Failed to share photo',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full md:w-96">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardContent>
    </Card>
  );
};
