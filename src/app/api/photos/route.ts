import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import Photo from '@/models/mongodb/Photo';
import { ObjectId } from 'mongodb';
import { generatePresignedUploadUrl, generateS3Key, deletePhotoFromS3 } from '@/lib/s3';

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();

    // Check if this is an admin request
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query based on search parameters
    const query: any = {};
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // If not admin, only return public photos
    if (!isAdmin) {
      query.isPublic = true;
    }

    // Get photos with pagination
    const photos = await Photo.find(query)
      .sort({ dateCreated: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Photo.countDocuments(query);

    return NextResponse.json({
      photos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('photos') as File[];
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tagsStr = formData.get('tags') as string;
    const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()) : [];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No photos provided' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const uploads = await Promise.all(
      files.map(async (file) => {
        const s3Key = generateS3Key(file.name);
        const { uploadUrl, publicUrl } = await generatePresignedUploadUrl(s3Key, file.type);

        // Create photo document
        const photo = new Photo({
          title: title || file.name,
          description: description || '',
          s3Key,
          url: publicUrl,
          size: file.size,
          mimeType: file.type,
          width: 0, // Will be updated after upload
          height: 0, // Will be updated after upload
          tags
        });

        await photo.save();

        return {
          photoId: photo._id.toString(),
          s3Key,
          uploadUrl,
          publicUrl
        };
      })
    );

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error('Error in photo upload:', error);
    return NextResponse.json(
      { error: 'Failed to process photo upload' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { photoId, title, description, tags } = data;

    if (!ObjectId.isValid(photoId)) {
      return NextResponse.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (title !== undefined) photo.title = title;
    if (description !== undefined) photo.description = description;
    if (tags !== undefined) photo.tags = tags;

    await photo.save();

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
    console.error('Error updating photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    console.log('Deleted photo:', photo); // Add logging
    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
