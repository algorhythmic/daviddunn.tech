import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'daviddunn.tech';
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    if (!CLOUDFRONT_URL) {
      throw new Error('CloudFront URL is not configured');
    }

    // Create the command to put an object in S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
      CacheControl: 'max-age=31536000', // 1 year cache
      // Removed ACL: 'public-read' as we'll use CloudFront with OAI
    });

    // Generate a pre-signed URL for uploading
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600,
    });

    // Generate the CloudFront URL for the file
    const fileUrl = `${CLOUDFRONT_URL}/${fileName}`;

    return NextResponse.json(
      { uploadUrl, fileUrl },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
