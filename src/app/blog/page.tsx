import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { BlogPost } from '@/types/schema';

export const metadata: Metadata = {
  title: 'Blog | David Dunn',
  description: 'Technical articles, tutorials, and insights about web development, TypeScript, and software engineering.',
};

async function getBlogPosts() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  const data = await response.json();
  return data.posts as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

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
          {posts.map((post) => (
            <BlogCard key={post._id.toString()} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
