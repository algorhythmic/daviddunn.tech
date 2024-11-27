import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import Photo from '@/models/mongodb/Photo';
import { generateS3Key } from '@/lib/s3';
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const photos = formData.getAll('photos');
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const tags = formData.get('tags') as string;

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: 'No photos provided' }, { status: 400 });
    }

    await connectToMongoDB();

    // Process each photo
    const uploadPromises = photos.map(async (file: any) => {
      try {
        // Generate a unique S3 key
        const s3Key = generateS3Key(file.name);

        // Upload directly to S3
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
          CacheControl: 'max-age=31536000', // Cache for 1 year
        });

        await s3Client.send(command);

        // Ensure the CloudFront URL doesn't have a trailing slash
        const baseUrl = CLOUDFRONT_URL!.replace(/\/$/, '');
        // Ensure the key doesn't start with a slash
        const cleanKey = s3Key.replace(/^\//, '');
        const publicUrl = `${baseUrl}/${cleanKey}`;

        // Create photo document
        const photo = new Photo({
          title: title || file.name.replace(/\.[^/.]+$/, ""),
          description: description || "",
          location: location || "",
          s3Key,
          url: publicUrl,
          size: file.size,
          mimeType: file.type,
          dateCreated: new Date(),
          dateUpdated: new Date(),
          tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        });

        await photo.save();

        return {
          photoId: photo._id,
          url: publicUrl
        };
      } catch (error) {
        console.error('Error processing photo:', error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      message: 'Photos uploaded successfully',
      uploads: results
    });
  } catch (error) {
    console.error('Error processing photo upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}
