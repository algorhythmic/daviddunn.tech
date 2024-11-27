'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface UploadPhotosProps {
  onSuccess?: () => void;
}

export function UploadPhotos({ onSuccess }: UploadPhotosProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    location: '',
    tags: ''
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    
    try {
      // Create FormData and append all files and form data
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('photos', file);
      });

      // Append form fields
      Object.entries(uploadForm).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);

      // Show success toast
      toast({
        title: 'Success',
        description: `Successfully uploaded ${files.length} photos`,
      });

      // Close dialog and reset form
      setUploadDialogOpen(false);
      setUploadForm({
        title: '',
        description: '',
        location: '',
        tags: ''
      });

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload photos',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setUploadDialogOpen(true)}>
        Upload Photos
      </Button>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
            <DialogDescription>
              Fill in the details and select photos to upload. Title is required, other fields are optional.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={uploadForm.title}
                onChange={handleFormChange}
                placeholder="Enter photo title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={uploadForm.description}
                onChange={handleFormChange}
                placeholder="Enter photo description"
                className="h-24"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={uploadForm.location}
                onChange={handleFormChange}
                placeholder="Enter photo location"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={uploadForm.tags}
                onChange={handleFormChange}
                placeholder="Enter tags (comma-separated)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photos">Select Photos</Label>
              <Input
                id="photos"
                type="file"
                onChange={handleUpload}
                accept="image/*"
                multiple
                disabled={isUploading}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
