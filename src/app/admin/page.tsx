'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image as ImageIcon, Plus, Upload } from 'lucide-react';
import { IPost, IPostWithId } from '@/models/post'; 
import { useState, useEffect } from 'react';
import { IPhoto } from '@/types/schema';

export default function AdminDashboard() {
  const { status } = useSession();
  const [stats, setStats] = useState<{ postCount: number; photoCount: number }>({ postCount: 0, photoCount: 0 });
  const [recentPosts, setRecentPosts] = useState<(IPost & { _id: string })[]>([]);
  const [photos, setPhotos] = useState<IPhoto[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/posts?limit=5');
        if (!response.ok) {
          throw new Error('Failed to fetch recent posts');
        }
        const data = await response.json();
        setRecentPosts(data.posts.map((post: IPostWithId) => ({
          ...post,
          _id: post._id.toString(),
        })));
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json();
        setPhotos(data.photos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchStats();
    fetchRecentPosts();
    fetchPhotos();
  }, []);

  if (status === 'loading') {
    return (
      <div className="container py-8">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard! Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Blog Posts',
            value: stats.postCount,
            icon: FileText,
            href: '/admin/blog',
            color: 'text-blue-500'
          },
          {
            title: 'Photos',
            value: stats.photoCount,
            icon: ImageIcon,
            href: '/admin/photos',
            color: 'text-green-500'
          },
          {
            title: 'New Post',
            value: '+',
            icon: Plus,
            href: '/admin/blog/new',
            color: 'text-purple-500'
          },
          {
            title: 'Upload Photos',
            value: '+',
            icon: Upload,
            href: '/admin/photos/upload',
            color: 'text-orange-500'
          }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-4 flex justify-center">
                    {stat.color && (
                      <span className={stat.color}>{stat.value}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Card key={post._id.toString()}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Link href={`/admin/blog/${post._id}`}>
                    <CardTitle className="text-lg hover:text-primary">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Photos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo._id.toString()}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Link href={`/admin/photos/${photo._id}`}>
                    <CardTitle className="text-lg hover:text-primary">
                      {photo.title}
                    </CardTitle>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
