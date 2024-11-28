import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { deleteObject } from '@/lib/s3';

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const { slug } = request.nextUrl.pathname.match(/\/photos\/(?<slug>[^/]+)/)?.groups ?? {};
    
    if (!slug || !ObjectId.isValid(slug)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const photos = db.connection.db.collection('photos');

    const photo = await photos.findOne(
      { _id: new ObjectId(slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

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
        url: photo.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${photo.s3Key}`,
        s3Key: photo.s3Key,
        thumbnailUrl: photo.thumbnailUrl,
        category: photo.category,
        camera: photo.camera,
        lens: photo.lens,
        tags: photo.tags?.sort() ?? [],
        location: photo.location,
        dateTaken: photo.dateTaken instanceof Date ? photo.dateTaken.toISOString() : photo.dateTaken,
        dateUploaded: photo.dateUploaded instanceof Date ? photo.dateUploaded.toISOString() : photo.dateUploaded,
        width: photo.width,
        height: photo.height,
        aperture: photo.aperture,
        shutterSpeed: photo.shutterSpeed,
        iso: photo.iso,
        focalLength: photo.focalLength
      }
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = request.nextUrl.pathname.match(/\/photos\/(?<slug>[^/]+)/)?.groups ?? {};
    
    if (!slug || !ObjectId.isValid(slug)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const photos = db.connection.db.collection('photos');

    // Find the photo first to get the S3 key
    const photo = await photos.findOne(
      { _id: new ObjectId(slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Delete from S3 first
    try {
      await deleteObject(photo.s3Key);
      if (photo.thumbnailUrl) {
        await deleteObject(photo.thumbnailUrl.split('/').pop()!);
      }
    } catch (error) {
      console.error('Error deleting from S3:', error);
      return NextResponse.json(
        { error: 'Failed to delete photo from S3' },
        { status: 500 }
      );
    }

    // Delete from MongoDB
    const result = await photos.deleteOne(
      { _id: new ObjectId(slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete photo from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = request.nextUrl.pathname.match(/\/photos\/(?<slug>[^/]+)/)?.groups ?? {};
    
    if (!slug || !ObjectId.isValid(slug)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const photos = db.connection.db.collection('photos');

    const photo = await photos.findOne(
      { _id: new ObjectId(slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      tags,
      location,
      camera,
      lens,
      aperture,
      shutterSpeed,
      iso,
      focalLength,
      dateTaken
    } = body;

    const updateFields: { [key: string]: any } = {};

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (tags !== undefined) updateFields.tags = tags;
    if (location !== undefined) updateFields.location = location;
    if (camera !== undefined) updateFields.camera = camera;
    if (lens !== undefined) updateFields.lens = lens;
    if (aperture !== undefined) updateFields.aperture = aperture;
    if (shutterSpeed !== undefined) updateFields.shutterSpeed = shutterSpeed;
    if (iso !== undefined) updateFields.iso = iso;
    if (focalLength !== undefined) updateFields.focalLength = focalLength;
    if (dateTaken !== undefined) updateFields.dateTaken = new Date(dateTaken);

    const result = await photos.updateOne(
      { _id: new ObjectId(slug) },
      { $set: updateFields },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'No changes made to photo' },
        { status: 400 }
      );
    }

    const updatedPhoto = await photos.findOne(
      { _id: new ObjectId(slug) },
      { maxTimeMS: 5000 } // Set a 5-second timeout for the query
    );

    if (!updatedPhoto) {
      return NextResponse.json(
        { error: 'Failed to fetch updated photo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      photo: {
        _id: updatedPhoto._id.toString(),
        title: updatedPhoto.title,
        description: updatedPhoto.description,
        url: updatedPhoto.url || `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${updatedPhoto.s3Key}`,
        s3Key: updatedPhoto.s3Key,
        thumbnailUrl: updatedPhoto.thumbnailUrl,
        category: updatedPhoto.category,
        camera: updatedPhoto.camera,
        lens: updatedPhoto.lens,
        tags: updatedPhoto.tags?.sort() ?? [],
        location: updatedPhoto.location,
        dateTaken: updatedPhoto.dateTaken instanceof Date ? updatedPhoto.dateTaken.toISOString() : updatedPhoto.dateTaken,
        dateUploaded: updatedPhoto.dateUploaded instanceof Date ? updatedPhoto.dateUploaded.toISOString() : updatedPhoto.dateUploaded,
        width: updatedPhoto.width,
        height: updatedPhoto.height,
        aperture: updatedPhoto.aperture,
        shutterSpeed: updatedPhoto.shutterSpeed,
        iso: updatedPhoto.iso,
        focalLength: updatedPhoto.focalLength
      }
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}
