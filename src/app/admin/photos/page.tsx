'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Upload } from 'lucide-react';

interface PhotoFormData {
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category?: string;
  tags?: string[];
  metadata: {
    width: number;
    height: number;
    camera?: {
      make?: string;
      model?: string;
      settings?: {
        iso?: number;
        aperture?: string;
        shutterSpeed?: string;
        focalLength?: string;
      };
    };
  };
}

export default function AdminPhotos() {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<PhotoFormData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      if (data.photos) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch photos. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        // Upload to your storage service (e.g., S3, Cloudinary)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { imageUrl, thumbnailUrl, metadata } = await uploadResponse.json();

        // Create photo record in MongoDB
        const photoData: PhotoFormData = {
          title: file.name.split('.')[0], // Default title from filename
          description: '',
          imageUrl,
          thumbnailUrl,
          metadata: {
            width: metadata.width,
            height: metadata.height,
            camera: metadata.camera,
          },
        };

        const createResponse = await fetch('/api/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(photoData),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create photo record');
        }

        // Refresh photos list
        await fetchPhotos();
      }

      toast({
        title: 'Success',
        description: `Successfully uploaded ${files.length} photo${files.length > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload photos. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos?id=${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      toast({
        title: 'Success',
        description: 'Photo deleted successfully.',
      });

      await fetchPhotos();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete photo. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Photos</h1>
          <p className="text-muted-foreground">
            Upload and manage your photos here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </>
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.imageUrl} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{photo.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {photo.description}
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/photos/${photo._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(photo._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {photos.length === 0 && (
          <Card className="border-dashed col-span-full">
            <CardContent className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
              <Plus className="h-8 w-8 mb-2" />
              <p>No photos uploaded yet</p>
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload your first photo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
