import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

if (!CLOUDFRONT_URL) {
  console.error('NEXT_PUBLIC_CLOUDFRONT_URL environment variable is not defined');
}

export async function generatePresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read', // Make the object publicly readable
    CacheControl: 'max-age=31536000', // Cache for 1 year
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  // Always use CloudFront URL for public access
  if (!CLOUDFRONT_URL) {
    throw new Error('NEXT_PUBLIC_CLOUDFRONT_URL environment variable is not defined');
  }

  // Ensure the CloudFront URL doesn't have a trailing slash
  const baseUrl = CLOUDFRONT_URL.replace(/\/$/, '');
  // Ensure the key doesn't start with a slash
  const cleanKey = key.replace(/^\//, '');
  const publicUrl = `${baseUrl}/${cleanKey}`;

  return { uploadUrl, publicUrl };
}

export async function generatePresignedGetUrl(key: string) {
  // For read operations, we should use CloudFront URL directly
  if (!CLOUDFRONT_URL) {
    throw new Error('NEXT_PUBLIC_CLOUDFRONT_URL environment variable is not defined');
  }
  
  // Ensure the CloudFront URL doesn't have a trailing slash
  const baseUrl = CLOUDFRONT_URL.replace(/\/$/, '');
  // Ensure the key doesn't start with a slash
  const cleanKey = key.replace(/^\//, '');
  return `${baseUrl}/${cleanKey}`;
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function deletePhotoFromS3(key: string, retries = 3): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME environment variable is not defined');
  }

  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempting to delete S3 object: ${key} (attempt ${attempt}/${retries})`);
      
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(command);
      
      // Check if the deletion was successful
      if (response.$metadata.httpStatusCode === 204) {
        console.log(`Successfully deleted object from S3: ${key}`);
        return;
      } else {
        throw new Error(`Unexpected status code: ${response.$metadata.httpStatusCode}`);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Error deleting object from S3: ${key} (attempt ${attempt}/${retries})`, error);
      
      if (attempt < retries) {
        // Wait before retrying, using exponential backoff
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Waiting ${waitTime}ms before retry...`);
        await delay(waitTime);
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw lastError || new Error(`Failed to delete object from S3 after ${retries} attempts`);
}

export function generateS3Key(filename: string) {
  // Remove special characters and spaces from filename
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  
  // Add timestamp to ensure uniqueness
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  return `photos/${timestamp}-${randomString}-${sanitizedFilename}`;
}
