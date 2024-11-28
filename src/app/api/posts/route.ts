import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { PostModel } from '@/models/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

type PostQuery = {
  published: boolean;
  category?: string;
  tags?: string;
  $text?: { $search: string };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const published = searchParams.get('published') !== 'false';

    await connectToDatabase();
    
    const query: PostQuery = { published };
    
    if (searchParams.has('category')) {
      const category = searchParams.get('category');
      if (category) {
        query.category = category;
      }
    }
    
    if (searchParams.has('tag')) {
      const tag = searchParams.get('tag');
      if (tag) {
        query.tags = tag;
      }
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const totalPosts = await PostModel.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    
    const posts = await PostModel.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await connectToDatabase();

    if (data.published) {
      data.publishedAt = new Date();
    }

    const post = new PostModel(data);
    await post.save();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (updateData.published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const post = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const post = await PostModel.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
