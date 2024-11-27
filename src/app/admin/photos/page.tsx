'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Image as ImageIcon } from 'lucide-react';

interface Photo {
  _id: string;
  title: string;
  description: string;
  location: string;
  url?: string;
  s3Key: string;
  dateCreated: string;
  dateUpdated: string;
  tags: string[];
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    location: '',
    tags: ''
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(data.photos || []);
      } catch (error) {
        console.error('Error fetching photos:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load photos',
          variant: 'destructive',
        });
      }
    };

    fetchPhotos();
  }, []);

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
      // Create FormData
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('photos', file);
      });
      
      // Add form data
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('location', uploadForm.location);
      formData.append('tags', uploadForm.tags);

      // Upload photos
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // Show success toast
      toast({
        title: 'Success',
        description: `Successfully uploaded ${files.length} photos`,
      });

      // Close dialog and refresh photos
      setIsUploadDialogOpen(false);
      
      // Reset form
      e.target.value = '';
      setUploadForm({
        title: '',
        description: '',
        location: '',
        tags: ''
      });

      // Refresh the photos list
      const photosResponse = await fetch('/api/photos');
      if (!photosResponse.ok) {
        throw new Error('Failed to refresh photos');
      }
      const updatedPhotos = await photosResponse.json();
      setPhotos(updatedPhotos.photos || []);
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

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete photo');
      }

      // Fetch updated photos list
      const updatedPhotos = await fetch('/api/photos');
      if (!updatedPhotos.ok) {
        const errorData = await updatedPhotos.json();
        throw new Error(errorData.error || 'Failed to refresh photos list');
      }
      const updatedPhotosData = await updatedPhotos.json();
      setPhotos(updatedPhotosData.photos || []);

      // Show success message
      toast({
        title: 'Success',
        description: data.message,
        status: 'success',
      });

      // Show any warnings if present
      if (data.warnings?.length > 0) {
        data.warnings.forEach((warning: string) => {
          toast({
            title: 'Warning',
            description: warning,
            status: 'warning',
            duration: 5000,
          });
        });
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete photo',
        status: 'error',
      });
    }
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;

    await handleDeletePhoto(photoToDelete._id);

    setIsDeleteDialogOpen(false);
    setPhotoToDelete(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Photos</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)}>Upload Photos</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div 
            key={photo._id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative aspect-[4/3] w-full">
              {photo.url ? (
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-6">
              <Link href={`/photos/${photo._id}`}>
                <h2 className="text-xl font-semibold mb-2">{photo.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {photo.description}
                </p>
                {photo.location && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {photo.location}
                  </p>
                )}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setPhotoToDelete(photo);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete Photo
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
            <DialogDescription>
              Click &ldquo;Upload Photos&rdquo; to add new photos to your gallery
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={uploadForm.title}
                onChange={handleFormChange}
                placeholder="Enter photo title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={uploadForm.description}
                onChange={handleFormChange}
                placeholder="Enter photo description"
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
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={uploadForm.tags}
                onChange={handleFormChange}
                placeholder="nature, landscape, etc."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photos">Photos</Label>
              <Input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this photo?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>The photo "{photoToDelete?.title}"</li>
              <li>The photo file from storage</li>
            </ul>
            <p className="text-sm text-muted-foreground font-semibold">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Photo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
