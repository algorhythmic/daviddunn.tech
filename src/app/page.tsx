'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { testPosts, testAlbums } from '@/data/testData';
import { streamlitApps } from '@/data/streamlit-apps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AnalyticsPreview } from '@/components/analytics/AnalyticsPreview';

export default function Home() {
  // Get the latest published blog posts
  const latestPosts = testPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 2);

  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);

  useEffect(() => {
    const appIntervalId = setInterval(() => {
      setCurrentAppIndex((prevIndex) => (prevIndex + 1) % streamlitApps.length);
    }, 5000);

    const albumIntervalId = setInterval(() => {
      setCurrentAlbumIndex((prevIndex) => (prevIndex + 1) % testAlbums.length);
    }, 6700);

    return () => {
      clearInterval(appIntervalId);
      clearInterval(albumIntervalId);
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-2">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Mobile Profile Picture - Only shown on mobile */}
        <div className="flex justify-center md:hidden">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/images/profile.svg" alt="David Dunn" />
            <AvatarFallback className="text-xl bg-cyan-600 text-white">DD</AvatarFallback>
          </Avatar>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-3">
          <p className="text-xl text-muted-foreground">Thank you for visiting my professional portfolio portal!</p>
        </div>

        {/* Content Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Streamlit Apps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Streamlit Apps
                <Link 
                  href="/streamlit-apps" 
                  className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="space-y-2 relative h-[300px] w-full">
                {/* Show cycling apps */}
                {streamlitApps.map((app, index) => (
                  <Link 
                    key={app.id} 
                    href={`/streamlit-apps`}
                    className={`block group space-y-3 transition-all duration-1000 absolute inset-0 ${
                      index === currentAppIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="aspect-video relative rounded-md overflow-hidden bg-muted h-[220px]">
                      <Image
                        src={app.imageUrl}
                        alt={app.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-2 px-1">
                      <h3 className="text-lg font-semibold leading-none tracking-tight line-clamp-1 text-center">{app.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2 text-center">{app.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Latest Blog Posts
                <Link 
                  href="/blog" 
                  className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {latestPosts.map(post => (
                  <Link 
                    key={post._id} 
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <h3 className="font-medium group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Photo Gallery
                <Link 
                  href="/photos" 
                  className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}> {/* 16:9 aspect ratio */}
                {testAlbums.map((album, index) => (
                  <Link 
                    key={album._id} 
                    href={`/photos`}
                    className={`block group absolute inset-0 transition-all duration-1000 ${
                      index === currentAlbumIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={album.coverPhotoUrl}
                        alt={album.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-semibold leading-tight line-clamp-1">{album.title}</h3>
                        <p className="text-sm opacity-90 line-clamp-2 mt-2">{album.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Preview */}
          <AnalyticsPreview />
        </div>
      </div>
    </main>
  );
}
