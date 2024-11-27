import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!params.id) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }

    const db = await connectToMongoDB();
    const result = await db.collection('photos').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Photo deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
