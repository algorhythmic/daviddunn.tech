import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Create S3 client with minimal configuration
const s3Client = new S3Client({
  region: 'us-east-2',
});

const BUCKET_NAME = 'daviddunn.tech';
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL!;

export async function uploadToS3(file: File, path: string): Promise<string> {
  try {
    // First, request a pre-signed URL from our API
    const response = await fetch('/api/s3/upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: `${path}/${Date.now()}-${file.name}`,
        contentType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fileUrl } = await response.json();

    // Upload the file using the pre-signed URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'Origin': window.location.origin,
      },
      mode: 'cors',
    });

    if (!uploadResponse.ok) {
      console.error('Upload failed with status:', uploadResponse.status);
      console.error('Upload response:', await uploadResponse.text());
      throw new Error(`Failed to upload file: ${uploadResponse.status}`);
    }

    console.log('Upload successful:', fileUrl);

    return fileUrl;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    throw new Error('Failed to upload file to S3. Please try again.');
  }
}
