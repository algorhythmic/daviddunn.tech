import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { BlogPost } from '@/types/schema';
import { connectToDatabase } from '@/lib/mongodb';

export const metadata: Metadata = {
  title: 'Blog | David Dunn',
  description: 'Technical articles, tutorials, and insights about web development, TypeScript, and software engineering.',
};

async function getBlogPosts() {
  try {
    console.log('Fetching blog posts...');
    const { db } = await connectToDatabase();
    
    const posts = await db.collection('posts')
      .find({ 
        status: 'published',
        publishedAt: { $ne: null }
      })
      .sort({ publishedAt: -1 })
      .toArray();

    console.log(`Found ${posts.length} published posts`);
    return posts as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
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

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No blog posts available yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogCard key={post._id.toString()} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
