import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { BlogPost } from '@/types/schema';

interface Props {
  params: {
    slug: string;
  };
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
  { params }: Props,
  parent: Promise<Metadata>
): Promise<Metadata> {
  // Wait for the parent metadata
  const previousMetadata = await parent;

  const post = await getBlogPost(params.slug);
  if (!post) return previousMetadata;

  return {
    ...previousMetadata,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);
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
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
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
