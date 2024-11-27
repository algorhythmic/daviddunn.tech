import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const s3Client = new S3Client({
  region: 'us-east-2',
});

const BUCKET_NAME = 'daviddunn.tech';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await request.json();
    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    console.log('Attempting to delete file:', { bucket: BUCKET_NAME, key });

    // Delete the object from S3
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    try {
      await s3Client.send(command);
      console.log('Successfully deleted file:', { bucket: BUCKET_NAME, key });
    } catch (deleteError) {
      console.error('Error from S3 delete command:', deleteError);
      if (deleteError instanceof Error) {
        return NextResponse.json(
          { error: `S3 deletion error: ${deleteError.message}` },
          { status: 500 }
        );
      }
      throw deleteError;
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error in delete route:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to delete file: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
