import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import BlogPost from '@/models/mongodb/BlogPost';

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const { slug } = request.nextUrl.pathname.match(/\/blog\/(?<slug>[^/]+)/)?.groups ?? {};

    await connectToMongoDB();
    
    const post = await BlogPost.findOne({ 
      slug,
      status: 'published'
    }).lean();

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
