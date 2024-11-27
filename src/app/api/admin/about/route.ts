import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import { AboutContent } from '@/models/about';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received data:', data); // Debug log

    await connectToMongoDB();
    
    // Ensure all fields exist with defaults
    const sanitizedData = {
      statement: data.statement || '',
      resumeUrl: data.resumeUrl || '',
      previewImages: {
        resume: data.previewImages?.resume || '',
        linkedin: data.previewImages?.linkedin || '',
        github: data.previewImages?.github || '',
        instagram: data.previewImages?.instagram || ''
      },
      socialLinks: {
        linkedin: data.socialLinks?.linkedin || '',
        github: data.socialLinks?.github || '',
        instagram: data.socialLinks?.instagram || ''
      },
      lastUpdated: new Date()
    };

    console.log('Sanitized data:', sanitizedData); // Debug log

    // Update or create about content
    const content = await AboutContent.findOneAndUpdate(
      {},
      { $set: sanitizedData }, // Use $set to update only specified fields
      { 
        upsert: true,
        new: true,
        runValidators: false, // Disable validation since we're handling it manually
        lean: true
      }
    ) as any;  // Temporarily type as any to handle the _id conversion

    if (!content) {
      console.error('No content returned after update');
      throw new Error('Failed to update content');
    }

    console.log('Updated content:', content); // Debug log

    // Convert _id to string and create a plain object
    const serializedContent = {
      ...content,
      _id: content._id?.toString() || '',  // Safely access and convert _id
      lastUpdated: content.lastUpdated.toISOString()
    };

    console.log('Serialized content:', serializedContent); // Debug log

    return NextResponse.json(serializedContent, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error updating about content:', error);
    
    // Type guard for Error object
    const err = error as Error;
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { error: 'Failed to update about content', details: err.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToMongoDB();
    const content = await AboutContent.findOne().lean() as any;

    if (!content) {
      return NextResponse.json({}, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Convert _id to string and create a plain object
    const serializedContent = {
      ...content,
      _id: content._id?.toString() || '',  // Safely access and convert _id
      lastUpdated: content.lastUpdated.toISOString()
    };

    return NextResponse.json(serializedContent, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    
    // Type guard for Error object
    const err = error as Error;
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { error: 'Failed to fetch about content', details: err.message },
      { status: 500 }
    );
  }
}
