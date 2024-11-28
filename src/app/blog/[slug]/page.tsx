import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { BlogPost } from '@/types/schema';

interface PageParams {
  slug: string;
}

async function getBlogPost(slug: string) {
  try {
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const response = await fetch(`${protocol}://${host}/api/blog/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch blog post');
    }
    const data = await response.json();
    return {
      ...data.post,
      _id: data.post._id.toString()
    } as BlogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.slug);
  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {post.featuredImage && (
            <div className="relative w-full h-[400px] mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}
