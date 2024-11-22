import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const CLOUDFRONT_URL = process.env.CLOUDFRONT_DISTRIBUTION_URL!;

export async function uploadToS3(file: File, path: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fileType = file.type;
  const fileName = `${path}/${Date.now()}-${file.name}`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(buffer),
        ContentType: fileType,
        CacheControl: 'max-age=31536000', // 1 year cache
      })
    );

    // Return the CloudFront URL
    return `${CLOUDFRONT_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}
