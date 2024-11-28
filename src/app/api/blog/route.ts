import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');

    console.log('Connecting to MongoDB...');
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB successfully');
    
    // Build query
    const query: Record<string, any> = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    console.log('Query parameters:', query);
    
    try {
      const totalPosts = await db.collection('posts').countDocuments(query);
      console.log('Total matching posts:', totalPosts);
      
      if (totalPosts === 0) {
        console.log('No posts found matching query');
        return NextResponse.json({
          posts: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalPosts: 0,
            hasMore: false
          }
        });
      }

      const totalPages = Math.ceil(totalPosts / limit);
      
      const posts = await db.collection('posts')
        .find(query)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

      console.log(`Found ${posts.length} posts`);

      return NextResponse.json({
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasMore: page < totalPages
        }
      });
    } catch (error) {
      console.error('Error querying posts:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in GET /api/blog:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
