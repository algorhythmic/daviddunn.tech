import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToMongoDB } from '@/lib/db';
import { ObjectId } from 'mongodb';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'admin') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const { slug } = params;
    
    if (!slug || !ObjectId.isValid(slug)) {
      return Response.json(
        { error: 'Invalid photo ID' },
        { status: 400 }
      );
    }

    const db = await connectToMongoDB();
    const result = await db.collection('photos').deleteOne({
      _id: new ObjectId(slug)
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { message: 'Photo deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting photo:', error);
    return Response.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
