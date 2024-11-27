'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { uploadToS3, deleteFromS3 } from '@/lib/s3-utils';
import { toast } from '@/components/ui/use-toast';

type SocialPlatform = 'linkedin' | 'github' | 'instagram';
type PreviewType = SocialPlatform | 'resume';

interface AboutContentFormProps {
  initialContent: {
    _id?: string;
    statement: string;
    resumeUrl: string;
    previewImages: {
      resume: string;
      linkedin: string;
      github: string;
      instagram: string;
    };
    socialLinks: {
      linkedin: string;
      github: string;
      instagram: string;
    };
    lastUpdated: string;
  } | null;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function AboutContentForm({ initialContent }: AboutContentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [content, setContent] = useState({
    statement: initialContent?.statement || '',
    resumeUrl: initialContent?.resumeUrl || '',
    previewImages: {
      resume: initialContent?.previewImages?.resume || '',
      linkedin: initialContent?.previewImages?.linkedin || '',
      github: initialContent?.previewImages?.github || '',
      instagram: initialContent?.previewImages?.instagram || '',
    },
    socialLinks: {
      linkedin: initialContent?.socialLinks?.linkedin || '',
      github: initialContent?.socialLinks?.github || '',
      instagram: initialContent?.socialLinks?.instagram || '',
    },
  });
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const previewInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const validateFileUpload = (file: File, type: 'resume' | 'preview'): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Error',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return false;
    }

    if (type === 'resume' && file.type !== 'application/pdf') {
      toast({
        title: 'Error',
        description: 'Resume must be a PDF file',
        variant: 'destructive',
      });
      return false;
    }

    if (type === 'preview' && !file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Preview must be an image file',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (file: File, type: 'resume' | 'preview', subtype?: PreviewType) => {
    if (!validateFileUpload(file, type)) return;

    try {
      const path = type === 'resume' ? 'resume' : `previews/${subtype}`;
      
      // If uploading a new resume, delete the old one first
      if (type === 'resume' && content.resumeUrl) {
        try {
          console.log('Attempting to delete old resume:', content.resumeUrl);
          await deleteFromS3(content.resumeUrl);
          console.log('Successfully deleted old resume');
        } catch (error) {
          console.error('Error deleting old resume:', error);
          // Show a warning toast but continue with upload
          toast({
            title: 'Warning',
            description: 'Could not delete old resume, but will continue with upload',
            variant: 'warning',
          });
        }
      }

      console.log('Uploading new file to path:', path);
      const url = await uploadToS3(file, path);
      console.log('File uploaded successfully, URL:', url);
      
      if (type === 'resume') {
        setContent(prev => ({ ...prev, resumeUrl: url }));
        console.log('Updated resume URL in state');
      } else if (subtype) {
        setContent(prev => {
          const updatedPreviewImages = {
            ...prev.previewImages,
            [subtype as PreviewType]: url
          };
          return {
            ...prev,
            previewImages: updatedPreviewImages
          };
        });
        console.log('Updated preview image URL in state');
      }
      
      setIsDirty(true);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const validateSocialLink = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate social links
    const invalidLinks = Object.entries(content.socialLinks)
      .filter(([, url]) => url && !validateSocialLink(url))
      .map(([platform]) => platform);

    if (invalidLinks.length > 0) {
      toast({
        title: 'Invalid Links',
        description: `Please enter valid URLs for: ${invalidLinks.join(', ')}`,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Prepare the data for submission
      const submissionData = {
        statement: content.statement,
        resumeUrl: content.resumeUrl,
        previewImages: {
          resume: content.previewImages.resume,
          linkedin: content.previewImages.linkedin,
          github: content.previewImages.github,
          instagram: content.previewImages.instagram,
        },
        socialLinks: {
          linkedin: content.socialLinks.linkedin,
          github: content.socialLinks.github,
          instagram: content.socialLinks.instagram,
        }
      };

      console.log('Submitting data:', submissionData); // Debug log

      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server response:', responseData); // Debug log
        throw new Error(responseData.details || 'Failed to save content');
      }

      console.log('Server response:', responseData); // Debug log

      setContent(responseData);
      router.refresh();
      setIsDirty(false);
      toast({
        title: 'Success',
        description: 'Content saved successfully',
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Statement */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>About Statement</Label>
              <Textarea
                value={content.statement}
                onChange={(e) => {
                  setContent(prev => ({ ...prev, statement: e.target.value }));
                  setIsDirty(true);
                }}
                placeholder="Enter your about statement..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Resume PDF</Label>
              <div className="flex items-center gap-4">
                <Input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'resume');
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => resumeInputRef.current?.click()}
                >
                  Choose File
                </Button>
                {content.resumeUrl && (
                  <span className="text-sm text-muted-foreground">
                    File selected
                  </span>
                )}
              </div>
            </div>
            {content.resumeUrl && (
              <div className="text-sm text-muted-foreground">
                Current resume: {content.resumeUrl}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Images */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium">Preview Images</h3>
            {Object.keys(content.previewImages).map((key) => (
              <div key={key}>
                <Label className="capitalize">{key} Preview</Label>
                <div className="flex items-center gap-4">
                  <Input
                    ref={(el) => (previewInputRefs.current[key] = el)}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'preview', key as PreviewType);
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => previewInputRefs.current[key]?.click()}
                  >
                    Choose File
                  </Button>
                  {content.previewImages[key as keyof typeof content.previewImages] && (
                    <span className="text-sm text-muted-foreground">
                      File selected
                    </span>
                  )}
                </div>
                {content.previewImages[key as keyof typeof content.previewImages] && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Current image: {content.previewImages[key as keyof typeof content.previewImages]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium">Social Links</h3>
            {Object.entries(content.socialLinks).map(([key, value]) => (
              <div key={key}>
                <Label className="capitalize">{key} URL</Label>
                <Input
                  type="url"
                  value={value}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    if (newUrl && !validateSocialLink(newUrl)) {
                      toast({
                        title: 'Invalid URL',
                        description: 'Please enter a valid URL',
                        variant: 'destructive',
                      });
                    }
                    setContent(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [key]: newUrl || ''
                      }
                    }));
                    setIsDirty(true);
                  }}
                  placeholder={`Enter your ${key} profile URL`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
