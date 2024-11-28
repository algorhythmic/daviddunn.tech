import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToDatabase } from '@/lib/mongodb';
import EditBlogForm from '@/components/admin/EditBlogForm';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/schema';

export const metadata: Metadata = {
  title: 'Blog Post Details | Admin',
  description: 'View and manage blog post details',
};

interface PageParams {
  slug: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { db } = await connectToDatabase();
    const post = await db.collection('posts').findOne({ slug });
    if (!post) return null;
    
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt || new Date(),
      updatedAt: post.updatedAt || new Date(),
      category: post.category,
      tags: post.tags || [],
      readingTime: post.readingTime || 0,
      status: post.status || 'draft',
      featuredImage: post.featuredImage,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      tableOfContents: post.tableOfContents,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return notFound();
  }

  const post = await getBlogPost(resolvedParams.slug);
  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Blog Post Details</h1>
          <Button asChild variant="outline">
            <Link href="/admin/blog">Back to Posts</Link>
          </Button>
        </div>
        <EditBlogForm post={post} />
      </div>
    </div>
  );
}
