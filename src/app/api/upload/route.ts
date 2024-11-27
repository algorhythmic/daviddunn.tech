import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type CameraMetadata = {
  make?: string;
  model?: string;
  lens?: string;
  settings?: {
    aperture?: string;
    shutterSpeed?: string;
    iso?: number;
    focalLength?: string;
  };
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Get image metadata using sharp
    const metadata = await sharp(buffer).metadata();
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    
    // Create thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(400, 300, { fit: 'cover' })
      .toBuffer();

    // Upload original image
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `photos/${filename}`,
      Body: buffer,
      ContentType: file.type,
    }));

    // Upload thumbnail
    const thumbnailFilename = `thumb_${filename}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `photos/thumbnails/${thumbnailFilename}`,
      Body: thumbnailBuffer,
      ContentType: file.type,
    }));

    // Extract EXIF data if available
    const camera: CameraMetadata = {};
    if (metadata.exif) {
      const exif = await sharp(buffer).metadata();
      if (exif.make) camera.make = exif.make;
      if (exif.model) camera.model = exif.model;
      // Add more EXIF data as needed
    }

    return NextResponse.json({
      imageUrl: `${process.env.AWS_CLOUDFRONT_URL}/photos/${filename}`,
      thumbnailUrl: `${process.env.AWS_CLOUDFRONT_URL}/photos/thumbnails/${thumbnailFilename}`,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        camera,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
