import Link from 'next/link';
import Image from 'next/image';
import { testPosts } from '@/data/testData';
import { streamlitApps } from '@/data/streamlit-apps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Home() {
  // Get the latest published blog posts
  const latestPosts = testPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 3);

  return (
    <main className="container mx-auto px-4 md:pt-2 pt-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mobile Profile Picture - Only shown on mobile */}
        <div className="flex justify-center md:hidden">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/images/profile.svg" alt="David Dunn" />
            <AvatarFallback className="text-2xl bg-cyan-600 text-white">DD</AvatarFallback>
          </Avatar>
        </div>

        {/* Welcome Section */}
        <div className="text-center my-8">
          <p className="text-2xl text-muted-foreground">Thank you for visiting my professional portfolio portal!</p>
        </div>

        {/* Featured Content */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Content</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Analytics Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Analytics Apps
                  <Link 
                    href="/analytics" 
                    className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {streamlitApps.slice(0, 2).map(app => (
                    <Link 
                      key={app.id} 
                      href={`/analytics`}
                      className="block group space-y-2"
                    >
                      <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                        <Image
                          src={app.imageUrl}
                          alt={app.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-primary">
                        {app.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {app.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{app.category}</Badge>
                        {app.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
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
                <div className="space-y-4">
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
              <CardContent>
                <div className="aspect-[4/3] relative rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Photos coming soon</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Check out my collection of photography, featuring landscapes, urban scenes, and more.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
