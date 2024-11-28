'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, FileText } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { IAboutContent } from '@/models/about';

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<IAboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/api/admin/about', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch about content');
        const data = await response.json();
        console.log('Fetched about content:', data);
        if (data.content) {
          setAboutContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutContent();
    // Refresh content every 30 seconds
    const interval = setInterval(fetchAboutContent, 30000);
    return () => clearInterval(interval);
  }, []);

  const profiles = useMemo(() => {
    console.log('Current about content:', aboutContent);
    const hasResume = aboutContent?.resumeUrl && aboutContent.resumeUrl.trim() !== '';
    const resumePreview = aboutContent?.previewImages?.resume;
    console.log('Has resume:', hasResume, 'Preview URL:', resumePreview);

    return [
      {
        title: 'Resume',
        description: 'View my professional experience, skills, and educational background.',
        icon: FileText,
        link: hasResume ? aboutContent.resumeUrl : undefined,
        previewUrl: resumePreview,
        previewText: hasResume 
          ? 'Download my latest resume to learn about my professional journey and technical expertise.'
          : 'Resume not available. Please check back later.',
      },
      {
        title: 'LinkedIn',
        description: 'Connect with me on LinkedIn and explore my professional network.',
        imageUrl: '/icons/linkedin.svg',
        link: aboutContent?.socialLinks?.linkedin || 'https://www.linkedin.com/in/daviddunntech',
        previewUrl: aboutContent?.previewImages?.linkedin,
        previewText: 'Software Engineer with experience in full-stack development and cloud technologies.',
      },
      {
        title: 'GitHub',
        description: 'Explore my open-source contributions and personal projects.',
        imageUrl: '/icons/github.svg',
        link: aboutContent?.socialLinks?.github || 'https://github.com/davidadunn',
        previewUrl: aboutContent?.previewImages?.github,
        previewText: 'Check out my coding projects and contributions to the developer community.',
      },
      {
        title: 'Instagram',
        description: 'Follow my photography and personal adventures.',
        imageUrl: '/icons/instagram.svg',
        link: aboutContent?.socialLinks?.instagram || 'https://www.instagram.com/davidadunn',
        previewUrl: aboutContent?.previewImages?.instagram,
        previewText: 'Visual stories from my travels and everyday moments.',
      },
    ];
  }, [aboutContent]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-2">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-2">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Site Description */}
        <div className="text-center space-y-3 mb-6">
          <h1 className="text-2xl font-bold">About This Site</h1>
          <p className="text-muted-foreground">
            This portfolio website was designed and developed by David Dunn in collaboration with Cascade, 
            a powerful AI assistant, using the revolutionary Windsurf IDE. It showcases a modern approach 
            to web development, combining human creativity with AI capabilities.
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {profiles.map((profile) => (
            <Link
              key={profile.title}
              href={profile.link || '#'}
              target={profile.link ? "_blank" : undefined}
              rel={profile.link ? "noopener noreferrer" : undefined}
              className={`block transition-transform ${profile.link ? 'hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
              onClick={e => !profile.link && e.preventDefault()}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {profile.title}
                    <ArrowUpRight className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative w-full aspect-video bg-muted rounded-md flex items-center justify-center p-8">
                      {profile.previewUrl ? (
                        <Image
                          src={profile.previewUrl}
                          alt={profile.title}
                          fill
                          className="object-contain p-2"
                          unoptimized // Add this to bypass image optimization for S3 URLs
                        />
                      ) : profile.icon ? (
                        <profile.icon className="w-12 h-12 text-foreground" />
                      ) : (
                        <Image
                          src={profile.imageUrl!}
                          alt={profile.title}
                          width={48}
                          height={48}
                          className="w-12 h-12 text-foreground"
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {!profile.link && profile.title === 'Resume' 
                        ? 'Resume not available. Please check back later.' 
                        : profile.previewText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
