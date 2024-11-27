import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import { deletePhotoFromS3 } from '@/lib/s3';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
): Promise<NextResponse> {
  const { id } = request.nextUrl.pathname.match(/\/photos\/(?<id>[^/]+)/)?.groups ?? {};
  const warnings: string[] = [];
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    const db = await connectToMongoDB();
    const photos = db.collection('photos');

    // Find the photo first to get the S3 key
    const photo = await photos.findOne({ _id: new ObjectId(id) });
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Try to delete from S3 if key exists
    if (photo.s3Key) {
      try {
        await deletePhotoFromS3(photo.s3Key);
      } catch (error) {
        console.error('Error deleting photo from S3:', error);
        warnings.push('Failed to delete photo from S3 storage, but metadata was removed');
      }
    } else {
      warnings.push('No S3 key found for photo, only removing metadata');
    }

    // Delete from MongoDB
    const result = await photos.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete photo from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Photo deleted successfully',
      photoId: id,
      warnings: warnings.length > 0 ? warnings : undefined
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete photo',
        warnings
      },
      { status: 500 }
    );
  }
}