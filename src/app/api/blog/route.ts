import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const status = searchParams.get('status') ?? 'all';
  const category = searchParams.get('category');

  console.log('Connecting to MongoDB...');
  const db = await connectToDatabase();
  if (!db) {
    throw new Error('Failed to connect to database');
  }
  console.log('Connected to MongoDB successfully');

  // Build query
  const query: { status?: string; category?: string } = {};

  console.log('Request params:', { status, category, limit, page });

  // Handle status
  if (status !== 'all') {
    query.status = status;
  }
  
  if (category) {
    query.category = category;
  }
  
  console.log('MongoDB query:', JSON.stringify(query, null, 2));

  try {
    // First, let's check all posts without any filters
    const allPosts = await db.connection.db.collection('posts').find({}).toArray();
    console.log('All posts in database:', allPosts);
    
    // Now check with our query
    const totalPosts = await db.connection.db.collection('posts').countDocuments(query);
    console.log('Total posts matching query:', totalPosts);

    if (totalPosts === 0) {
      console.log('No posts found matching the query');
      return NextResponse.json({
        posts: [],
        pagination: {
          totalPosts: 0,
          totalPages: 0,
          currentPage: page,
          hasMore: false,
        },
      });
    }

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await db.connection.db.collection('posts')
      .find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Transform posts for client consumption
    const transformedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(), // Convert ObjectId to string
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
      updatedAt: new Date(post.updatedAt).toISOString(),
    }));

    console.log(`Found ${posts.length} posts. Transformed posts:`, transformedPosts);

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        totalPosts,
        totalPages,
        currentPage: page,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
