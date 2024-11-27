'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Image as ImageIcon, Plus } from 'lucide-react';
import { testPosts } from '@/data/testData';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  icon: LucideIcon;
  href: string;
  action?: {
    label: string;
    href: string;
    icon: LucideIcon;
  };
}

export default function AdminDashboard() {
  const { status } = useSession();

  const stats: StatItem[] = [
    {
      title: 'Total Blog Posts',
      value: testPosts.length,
      icon: FileText,
      href: '/admin/blog',
      action: {
        label: 'New Post',
        href: '/admin/blog/new',
        icon: Plus,
      },
    },
    {
      title: 'Published Posts',
      value: testPosts.filter(post => post.status === 'published').length,
      icon: FileText,
      href: '/admin/blog',
    },
    {
      title: 'Draft Posts',
      value: testPosts.filter(post => post.status === 'draft').length,
      icon: FileText,
      href: '/admin/blog?status=draft',
    },
    {
      title: 'Total Photos',
      value: '0', // We'll update this when we implement photo management
      icon: ImageIcon,
      href: '/admin/photos',
      action: {
        label: 'Upload Photo',
        href: '/admin/photos/upload',
        icon: Plus,
      },
    },
  ];

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

  const recentPosts = testPosts
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title + index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-4 flex justify-center">
                  {stat.action && (
                    <Link href={stat.action.href}>
                      <Button size="sm">
                        <stat.action.icon className="h-4 w-4 mr-2" />
                        {stat.action.label}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
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
                    {post.status}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
