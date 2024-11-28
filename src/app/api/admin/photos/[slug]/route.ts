import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { connectToDatabase } from '@/lib/db';
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
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const params = await context.params;
    const { slug } = params;
    
    if (!slug || !ObjectId.isValid(slug)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid photo ID' }),
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      throw new Error('Failed to connect to database');
    }

    const photo = await db.connection.db.collection('photos').findOne({
      _id: new ObjectId(slug)
    });

    if (!photo) {
      return new NextResponse(null, { status: 404 });
    }

    const result = await db.connection.db.collection('photos').deleteOne({
      _id: new ObjectId(slug)
    });

    if (result.deletedCount === 0) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('Error deleting photo:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete photo' }),
      { status: 500 }
    );
  }
}
