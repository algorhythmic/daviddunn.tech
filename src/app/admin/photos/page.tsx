'use client';

import { useState, useRef } from 'react';
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
  url: string;
  thumbnailUrl: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // TODO: Implement photo upload logic
      toast({
        title: 'Coming Soon',
        description: 'Photo upload functionality will be implemented soon.',
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
            <Upload className="h-4 w-4 mr-2" />
            Upload Photos
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

      {/* Placeholder for photo grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-dashed">
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
      </div>
    </div>
  );
}
