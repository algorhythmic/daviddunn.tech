'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { testPosts } from '@/data/testData';
import { streamlitApps } from '@/data/streamlit-apps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PhotoModal from '@/components/PhotoModal';
import { AnalyticsPreview } from '@/components/analytics/AnalyticsPreview';
import { Photo } from '@/types/schema';
import { CalendarDays, ArrowRight, Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PhotoResponse {
  photos: Photo[];
  totalPhotos: number;
}

export default function Home() {
  // Get the latest published blog posts
  const latestPosts = testPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 2);

  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const appIntervalId = setInterval(() => {
      setCurrentAppIndex((prevIndex) => (prevIndex + 1) % streamlitApps.length);
    }, 5000);

    return () => {
      clearInterval(appIntervalId);
    };
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos?limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(data.photos || []);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
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
        <div className="text-center py-3">
          <p className="text-xl text-muted-foreground">Thank you for visiting my professional portfolio portal!</p>
        </div>

        {/* Content Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Streamlit Apps */}
          <Card className="border-gray-300 dark:border-gray-700">
            <CardHeader className="pb-4">
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
            <CardContent className="p-6 pt-0">
              <div className="relative w-full" style={{ paddingBottom: "85%" }}> {/* 4:3 aspect ratio */}
                {streamlitApps.map((app, index) => (
                  <Link 
                    key={app.id} 
                    href={`/streamlit-apps`}
                    className={`block group absolute inset-0 transition-all duration-1000 ${
                      index === currentAppIndex ? 'opacity-100 translate-x-0 rotate-0 scale-100' : 'opacity-0 -translate-x-full rotate-12 scale-90'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
                      <Image
                        src={app.imageUrl}
                        alt={app.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white [text-shadow: 0 1px 2px rgb(0 0 0 / 0.9)]">
                        <h3 className="text-2xl font-semibold leading-tight line-clamp-1">{app.title}</h3>
                        <p className="text-sm opacity-90 line-clamp-2 mt-2">{app.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest Blog Posts */}
          <Card className="border-gray-300 dark:border-gray-700">
            <CardHeader className="pb-4">
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
                    key={post._id.toString()} 
                    href={`/blog/${post.slug}`}
                    className="block group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Gallery Preview */}
        <Card className="border-gray-300 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo Gallery
              </div>
              <Link 
                href="/photos" 
                className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <button
                  key={photo._id.toString()}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 p-4 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium line-clamp-2 [text-shadow: 0 1px 2px rgb(0 0 0 / 0.9)]">
                      {photo.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Preview */}
        <Card className="border-gray-300 dark:border-gray-700">
          <CardHeader className="pb-4">
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPreview />
          </CardContent>
        </Card>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </main>
  );
}
