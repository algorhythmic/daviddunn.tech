'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFPreview } from '@/components/ui/pdf-preview';
import { ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  const profiles = [
    {
      title: 'Resume',
      description: 'View my professional experience, skills, and educational background.',
      imageUrl: '/images/resume-preview.png',
      link: 'https://d3qpg5syynu736.cloudfront.net/resume/1732308089426-DDCV112124.pdf',
      previewText: 'Download my latest resume to learn about my professional journey and technical expertise.',
    },
    {
      title: 'LinkedIn',
      description: 'Connect with me on LinkedIn and explore my professional network.',
      imageUrl: '/icons/linkedin.svg',
      link: 'https://www.linkedin.com/in/daviddunntech',
      previewText: 'Software Engineer with experience in full-stack development and cloud technologies.',
    },
    {
      title: 'GitHub',
      description: 'Explore my open-source contributions and personal projects.',
      imageUrl: '/icons/github.svg',
      link: 'https://github.com/davidadunn',
      previewText: 'Check out my coding projects and contributions to the developer community.',
    },
    {
      title: 'Instagram',
      description: 'Follow my photography and personal adventures.',
      imageUrl: '/icons/instagram.svg',
      link: 'https://www.instagram.com/davidadunn',
      previewText: 'Visual stories from my travels and everyday moments.',
    },
  ];

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
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:scale-105"
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
                    {profile.title === 'Resume' ? (
                      <PDFPreview url={profile.link} width={300} />
                    ) : (
                      <div className="relative w-full aspect-video bg-muted rounded-md flex items-center justify-center p-8">
                        <Image
                          src={profile.imageUrl}
                          alt={profile.title}
                          width={48}
                          height={48}
                          className="w-12 h-12 text-foreground"
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{profile.previewText}</p>
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
