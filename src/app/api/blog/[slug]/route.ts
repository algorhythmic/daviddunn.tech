import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
): Promise<NextResponse> {
  try {
    const slug = await context.params.slug;
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid slug' },
        { status: 400 }
      );
    }

    // Check if user is authenticated (for viewing draft posts)
    const session = await getServerSession(authOptions);
    const isAdmin = !!session?.user;

    const { db } = await connectToDatabase();
    
    // Build query based on authentication status
    const query: Record<string, any> = { slug };
    if (!isAdmin) {
      query.status = 'published';
    }
    
    const post = await db.collection('posts').findOne(query);

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
      { error: 'Failed to fetch blog post', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { slug: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const slug = await context.params.slug;
    const formData = await request.formData();
    const { db } = await connectToDatabase();

    // Find the existing post
    const existingPost = await db.collection('posts').findOne({ slug });
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Extract form data
    const newSlug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;
    const tags = JSON.parse(formData.get('tags') as string);
    const featuredImage = formData.get('featuredImage') as File | null;

    // If slug is being changed, check if new slug is available
    if (newSlug !== slug) {
      const slugExists = await db.collection('posts').findOne({ 
        slug: newSlug,
        _id: { $ne: existingPost._id } 
      });
      if (slugExists) {
        return NextResponse.json(
          { error: 'A post with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      slug: newSlug,
      content,
      excerpt,
      category,
      status,
      tags,
      updatedAt: new Date(),
    };

    // Handle featured image upload if provided
    if (featuredImage instanceof File) {
      const buffer = Buffer.from(await featuredImage.arrayBuffer());
      const key = `blog/${newSlug}/${featuredImage.name}`;
      
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: featuredImage.type,
        })
      );

      updateData.featuredImage = `${CLOUDFRONT_URL}/${key}`;
    }

    // Update the post
    const result = await db.collection('posts').updateOne(
      { slug },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}
