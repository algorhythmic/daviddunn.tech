import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    // Read the SVG file
    const svgPath = path.join(process.cwd(), 'public', 'images', 'placeholder-album.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    // Upload to S3
    const key = 'placeholders/placeholder-album.svg';
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: svgContent,
        ContentType: 'image/svg+xml',
      })
    );

    return NextResponse.json({ 
      success: true, 
      key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });
  } catch (error) {
    console.error('Error uploading placeholder:', error);
    return NextResponse.json(
      { error: 'Failed to upload placeholder' },
      { status: 500 }
    );
  }
}
