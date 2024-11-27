import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { testPosts } from '@/data/testData';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

interface Props {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = testPosts.find((post) => post.slug === resolvedParams.slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = testPosts.find((post) => post.slug === resolvedParams.slug);
  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              {post.category}
            </span>
          </div>
          <div className="text-muted-foreground">
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="mx-2">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {/* Table of Contents */}
        {post.tableOfContents && (
          <nav className="bg-muted p-4 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
            <ul className="space-y-1">
              {post.tableOfContents.items.map((item) => (
                <li key={item.url}>
                  <a href={item.url} className="text-primary hover:underline">
                    {item.title}
                  </a>
                  {item.items && (
                    <ul className="pl-4 mt-1 space-y-1">
                      {item.items.map((subItem) => (
                        <li key={subItem.url}>
                          <a href={subItem.url} className="text-primary hover:underline">
                            {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Content */}
        <MarkdownRenderer content={post.content} />

        {/* Tags */}
        <footer className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
