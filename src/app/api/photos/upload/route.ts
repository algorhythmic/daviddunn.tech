import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToDatabase } from '@/lib/mongodb';
import { PhotoModel } from '@/models/photo';
import { IPhoto } from '@/types/schema';
import { generateS3Key } from '@/lib/s3';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from 'sharp';
import { ExifImage } from 'exif';
import { promisify } from 'util';

interface ExifData {
  make?: string;
  model?: string;
  lensModel?: string;
  focalLength?: string;
  aperture?: string;
  exposureTime?: string;
  iso?: number;
  dateTaken?: Date;
}

interface ExifImageData {
  image: {
    Make?: string;
    Model?: string;
    [key: string]: unknown;
  };
  exif: {
    ExposureTime?: number;
    FNumber?: number;
    ISO?: number;
    FocalLength?: number;
    LensModel?: string;
    DateTimeOriginal?: string;
    [key: string]: unknown;
  };
}

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

    // Verify all items are files
    if (!photos.every((item): item is File => item instanceof File)) {
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    await connectToDatabase();

    // Process each photo
    const photoMetadataPromises = photos.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const sharpInstance = sharp(Buffer.from(buffer));
      const metadata = await sharpInstance.metadata();

      const s3Key = generateS3Key(file.name);
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: Buffer.from(buffer),
        ContentType: file.type,
        CacheControl: 'max-age=31536000', // Cache for 1 year
      };

      // Upload to S3
      await s3Client.send(new PutObjectCommand(uploadParams));

      // Ensure the CloudFront URL doesn't have a trailing slash
      const baseUrl = CLOUDFRONT_URL!.replace(/\/$/, '');
      // Ensure the key doesn't start with a slash
      const cleanKey = s3Key.replace(/^\//, '');
      const publicUrl = `${baseUrl}/${cleanKey}`;

      // Extract EXIF data if available
      let exifData: ExifData | null = null;
      if (metadata.exif) {
        try {
          const getExif = promisify((buffer: Buffer, cb: (error: Error | null, data?: ExifImageData) => void) => {
            new ExifImage({ image: buffer }, (error, data) => cb(error, data));
          });

          const exif = await getExif(Buffer.from(buffer));
          if (exif && exif.image && exif.exif) {
            // Parse EXIF date (format: YYYY:MM:DD HH:mm:ss)
            let dateTaken: Date | undefined;
            if (exif.exif.DateTimeOriginal) {
              const [datePart, timePart] = exif.exif.DateTimeOriginal.split(' ');
              if (datePart && timePart) {
                const [year, month, day] = datePart.split(':').map(Number);
                const [hour, minute, second] = timePart.split(':').map(Number);
                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                  dateTaken = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
                }
              }
            }

            exifData = {
              make: exif.image.Make,
              model: exif.image.Model,
              lensModel: exif.exif.LensModel,
              focalLength: exif.exif.FocalLength ? `${exif.exif.FocalLength}mm` : undefined,
              aperture: exif.exif.FNumber ? `f/${exif.exif.FNumber}` : undefined,
              exposureTime: exif.exif.ExposureTime ? `${exif.exif.ExposureTime}s` : undefined,
              iso: exif.exif.ISO,
              dateTaken: dateTaken
            };
          }
        } catch (error) {
          console.error('Error extracting EXIF data:', error);
          // Continue without EXIF data
        }
      }

      // Create photo document with IPhoto structure
      const photoData: Partial<IPhoto> = {
        title: title || file.name.replace(/\.[^/.]+$/, ""),
        description: description || "",
        location: location || "",
        s3Key,
        url: publicUrl,
        size: file.size,
        mimeType: file.type,
        dateCreated: new Date(),
        dateUpdated: new Date(),
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        metadata: {
          dateTaken: exifData?.dateTaken && !isNaN(exifData.dateTaken.getTime()) 
            ? exifData.dateTaken 
            : new Date(), // Fallback to current date if EXIF date is invalid
          camera: exifData?.make && exifData.model ? `${exifData.make} ${exifData.model}` : undefined,
          lens: exifData?.lensModel,
          location: location || undefined,
          settings: {
            aperture: exifData?.aperture,
            shutterSpeed: exifData?.exposureTime,
            iso: exifData?.iso,
            focalLength: exifData?.focalLength,
            width: metadata.width,
            height: metadata.height
          }
        }
      };

      // Create and save the photo
      const photo = await PhotoModel.create(photoData);

      return {
        photoId: photo._id,
        url: publicUrl
      };
    });

    const results = await Promise.all(photoMetadataPromises);

    return NextResponse.json({
      message: 'Photos uploaded successfully',
      photos: results
    });

  } catch (error) {
    console.error('Error uploading photos:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload photos' },
      { status: 500 }
    );
  }
}
