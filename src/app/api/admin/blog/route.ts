import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogPost } from '@/models/mongodb/BlogPost';
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    console.log('Received form data:', Object.fromEntries(formData.entries()));
    
    // Handle image upload first if present
    let featuredImageUrl = '';
    const imageFile = formData.get('featuredImage') as File | null;
    
    if (imageFile) {
      try {
        console.log('Processing image:', imageFile.name);
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const key = `blog/images/${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        
        const uploadParams = {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: imageFile.type,
          CacheControl: 'max-age=31536000', // Cache for 1 year
        };

        // Upload to S3
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Ensure the CloudFront URL doesn't have a trailing slash
        const baseUrl = CLOUDFRONT_URL!.replace(/\/$/, '');
        featuredImageUrl = `${baseUrl}/${key}`;
        console.log('Image uploaded successfully:', featuredImageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: 'Failed to upload image', details: error instanceof Error ? error.message : String(error) },
          { status: 500 }
        );
      }
    }

    // Get other form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as string;
    const tags = JSON.parse(formData.get('tags') as string) as string[];
    const status = formData.get('status') as 'draft' | 'published';

    if (!title || !slug || !content || !excerpt || !category) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    console.log('Connecting to MongoDB...');
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');
    
    // Create blog post document
    const blogPost = {
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      status,
      readingTime,
      featuredImage: featuredImageUrl,
      publishedAt: status === 'published' ? new Date() : null,
      updatedAt: new Date(),
    };

    console.log('Creating blog post:', blogPost);

    // Insert into MongoDB
    const result = await db.collection('posts').insertOne(blogPost);

    if (!result.insertedId) {
      console.error('Failed to insert blog post');
      throw new Error('Failed to create blog post');
    }

    console.log('Blog post created successfully:', result.insertedId);

    return NextResponse.json({
      success: true,
      post: {
        ...blogPost,
        _id: result.insertedId,
      },
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create blog post',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
