import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import { deletePhotoFromS3 } from '@/lib/s3';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  const { id } = request.nextUrl.pathname.match(/\/photos\/(?<id>[^/]+)/)?.groups ?? {};
  
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    const db = await connectToMongoDB();
    const photos = db.collection('photos');

    const photo = await photos.findOne({ _id: new ObjectId(id) });
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      photo: {
        _id: photo._id.toString(),
        title: photo.title,
        description: photo.description,
        url: photo.url,
        tags: photo.tags,
        metadata: photo.metadata,
        dateCreated: photo.dateCreated,
        dateUpdated: photo.dateUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

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

export async function PATCH(
  request: NextRequest,
): Promise<NextResponse> {
  const { id } = request.nextUrl.pathname.match(/\/photos\/(?<id>[^/]+)/)?.groups ?? {};
  
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

    const updates = await request.json();

    // Validate required fields
    if (!updates.title && !updates.description && !updates.tags && !updates.metadata) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const db = await connectToMongoDB();
    const photos = db.collection('photos');

    const photo = await photos.findOne({ _id: new ObjectId(id) });
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    type PhotoUpdateFields = {
      dateUpdated: Date;
      title?: string;
      description?: string;
      tags?: string[];
      metadata?: {
        dateTaken?: Date;
        camera?: string;
        lens?: string;
        settings?: {
          aperture?: string;
          shutterSpeed?: string;
          iso?: number;
          focalLength?: string;
        };
      };
    };

    const updateFields: PhotoUpdateFields = { dateUpdated: new Date() };
    if (updates.title !== undefined) updateFields.title = updates.title;
    if (updates.description !== undefined) updateFields.description = updates.description;
    if (updates.tags !== undefined) updateFields.tags = updates.tags;
    if (updates.metadata !== undefined) updateFields.metadata = { ...photo.metadata, ...updates.metadata };

    const result = await photos.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update photo' },
        { status: 500 }
      );
    }

    const updatedPhoto = await photos.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      photo: {
        _id: updatedPhoto._id.toString(),
        title: updatedPhoto.title,
        description: updatedPhoto.description,
        url: updatedPhoto.url,
        tags: updatedPhoto.tags,
        metadata: updatedPhoto.metadata,
        dateCreated: updatedPhoto.dateCreated,
        dateUpdated: updatedPhoto.dateUpdated
      }
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update photo' },
      { status: 500 }
    );
  }
}
