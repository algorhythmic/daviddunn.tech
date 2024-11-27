import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PhotoModel } from '@/models/photo';
import { PostModel } from '@/models/post';

export async function GET() {
  try {
    await connectToDatabase();

    // Get counts
    const [postCount, photoCount] = await Promise.all([
      PostModel.countDocuments(),
      PhotoModel.countDocuments()
    ]);

    return NextResponse.json({
      postCount,
      photoCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
