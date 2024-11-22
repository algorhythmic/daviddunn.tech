import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import { Photo } from '@/models/photo';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { generatePresignedUploadUrl, generatePresignedGetUrl, deletePhotoFromS3, generateS3Key } from '@/lib/s3';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');

    await connectToMongoDB();
    
    let query: any = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const totalPhotos = await Photo.countDocuments(query);
    const totalPages = Math.ceil(totalPhotos / limit);
    
    const photos = await Photo.find(query)
      .sort({ dateTaken: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Generate presigned URLs for each photo
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const url = await generatePresignedGetUrl(photo.s3Key);
        return {
          ...photo.toObject(),
          url,
        };
      })
    );

    return NextResponse.json({
      photos: photosWithUrls,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { filename, contentType, title, description, category } = data;

    // Generate a unique key for S3
    const s3Key = generateS3Key(filename);

    // Generate a pre-signed URL for uploading
    const uploadUrl = await generatePresignedUploadUrl(s3Key, contentType);

    await connectToMongoDB();
    const photo = new Photo({
      title,
      description,
      category,
      s3Key,
      dateTaken: new Date(),
    });
    await photo.save();

    return NextResponse.json({ uploadUrl, photo });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json({ error: 'Failed to create photo' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }

    const data = await request.json();
    await connectToMongoDB();

    const photo = await Photo.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    await connectToMongoDB();
    const photo = await Photo.findById(id);

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete from S3 first
    await deletePhotoFromS3(photo.s3Key);

    // Then delete from MongoDB
    await Photo.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
