import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | David Dunn',
  description: 'Learn more about David Dunn and his professional background.',
};

export default function AboutPage() {
  const profiles = [
    {
      title: 'Resume',
      description: 'View my professional experience, skills, and educational background.',
      imageUrl: '/images/resume-preview.png',
      link: '/resume.pdf',
      previewText: 'Download my latest resume to learn about my professional journey and technical expertise.',
    },
    {
      title: 'LinkedIn',
      description: 'Connect with me on LinkedIn and explore my professional network.',
      imageUrl: '/images/linkedin-preview.png',
      link: 'https://www.linkedin.com/in/daviddunntech',
      previewText: 'Software Engineer with experience in full-stack development and cloud technologies.',
    },
    {
      title: 'GitHub',
      description: 'Explore my open-source contributions and personal projects.',
      imageUrl: '/images/github-preview.png',
      link: 'https://github.com/davidadunn',
      previewText: 'Check out my coding projects and contributions to the developer community.',
    },
    {
      title: 'Instagram',
      description: 'Follow my photography and personal adventures.',
      imageUrl: '/images/instagram-preview.png',
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
            <Card key={profile.title}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  {profile.title}
                  <Link 
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    View
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted mb-2">
                  <Image
                    src={profile.imageUrl}
                    alt={profile.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {profile.previewText}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
