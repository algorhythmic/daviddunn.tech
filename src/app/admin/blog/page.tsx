'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { testPosts } from '@/data/testData';

export default function BlogAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts here.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {testPosts.map((post) => (
          <Card key={post._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Link href={`/admin/blog/${post._id}`}>
                  <CardTitle className="text-xl hover:text-primary">
                    {post.title}
                  </CardTitle>
                </Link>
                <span className={`text-sm ${
                  post.status === 'published' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {post.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Last updated {post.updatedAt.toLocaleDateString()}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/blog/${post._id}`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
