import { Metadata } from 'next';
import { testPosts } from '@/data/testData';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog | David Dunn',
  description: 'Technical articles, tutorials, and insights about web development, TypeScript, and software engineering.',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thoughts and tutorials about web development, TypeScript, and software engineering.
          Subscribe to my <a 
            href="https://daviddunn.substack.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Substack
          </a> for updates.
        </p>

        <div className="grid gap-8">
          {testPosts
            .filter(post => post.status === 'published')
            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
            .map((post) => (
              <BlogCard key={post._id.toString()} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
}
