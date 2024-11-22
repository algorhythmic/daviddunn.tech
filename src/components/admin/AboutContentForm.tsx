'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { IAboutContent } from '@/models/about';
import { uploadToS3 } from '@/lib/s3-utils';

interface AboutContentFormProps {
  initialContent: IAboutContent | null;
}

export function AboutContentForm({ initialContent }: AboutContentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<Partial<IAboutContent>>(
    initialContent || {
      socialLinks: { linkedin: '', github: '', instagram: '' },
      previewImages: { resume: '', linkedin: '', github: '', instagram: '' },
      resumeUrl: '',
    }
  );

  const handleFileUpload = async (file: File, type: 'resume' | 'preview', subtype?: string) => {
    try {
      const path = type === 'resume' ? 'resume' : `previews/${subtype}`;
      const url = await uploadToS3(file, path);
      
      if (type === 'resume') {
        setContent(prev => ({ ...prev, resumeUrl: url }));
      } else if (subtype) {
        setContent(prev => ({
          ...prev,
          previewImages: {
            ...prev.previewImages,
            [subtype]: url
          }
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // TODO: Add error toast notification
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) throw new Error('Failed to save content');

      router.refresh();
      // TODO: Add success toast notification
    } catch (error) {
      console.error('Error saving content:', error);
      // TODO: Add error toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resume Upload */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label>Resume PDF</Label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'resume');
                }}
              />
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
            {Object.keys(content.previewImages || {}).map((key) => (
              <div key={key}>
                <Label className="capitalize">{key} Preview</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'preview', key);
                  }}
                />
                {content.previewImages?.[key as keyof typeof content.previewImages] && (
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
            {Object.entries(content.socialLinks || {}).map(([key, value]) => (
              <div key={key}>
                <Label className="capitalize">{key} URL</Label>
                <Input
                  type="url"
                  value={value}
                  onChange={(e) => 
                    setContent(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [key]: e.target.value
                      }
                    }))
                  }
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
