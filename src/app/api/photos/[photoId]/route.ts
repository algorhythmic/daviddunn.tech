import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import { Photo } from '@/models/mongodb/Photo';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updates = await request.json();

    // Validate updates
    const allowedFields = ['title', 'description', 'location', 'tags'];
    const invalidFields = Object.keys(updates).filter(
      field => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return new NextResponse(
        `Invalid fields: ${invalidFields.join(', ')}`,
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const photo = await Photo.findByIdAndUpdate(
      params.photoId,
      { $set: updates },
      { new: true }
    );

    if (!photo) {
      return new NextResponse('Photo not found', { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error updating photo:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
