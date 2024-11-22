import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import { AboutContent } from '@/models/about';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectToMongoDB();

    // Update or create about content
    const content = await AboutContent.findOneAndUpdate(
      {},
      { 
        ...data,
        lastUpdated: new Date()
      },
      { 
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToMongoDB();
    const content = await AboutContent.findOne().lean();
    return NextResponse.json(content || {});
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}
