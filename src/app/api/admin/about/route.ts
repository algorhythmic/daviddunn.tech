import { NextResponse, NextRequest } from 'next/server';
import { connectToMongoDB } from '@/lib/db';
import { AboutContent, IAboutContent } from '@/models/about';
import { Types, Document } from 'mongoose';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type LeanAboutContent = Omit<IAboutContent, keyof Document> & {
  _id: Types.ObjectId;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const statement = formData.get('statement') as string;
    const resumeUrl = formData.get('resumeUrl') as string;
    const socialLinks = {
      linkedin: formData.get('linkedin') as string,
      github: formData.get('github') as string,
      instagram: formData.get('instagram') as string,
    };

    await connectToMongoDB();

    // Validate required fields
    if (!statement) {
      return NextResponse.json(
        { error: 'Statement is required' },
        { status: 400 }
      );
    }

    // Update or create about content
    const content = (await AboutContent.findOneAndUpdate(
      {},
      {
        $set: {
          statement,
          resumeUrl,
          socialLinks,
          lastUpdated: new Date(),
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: false, // Disable validation since we're handling it manually
        lean: true
      }
    )) as LeanAboutContent;

    if (!content) {
      console.error('No content returned after update');
      throw new Error('Failed to update content');
    }

    // Convert _id to string and return response
    return NextResponse.json({
      content: {
        ...content,
        _id: content._id.toString(),
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

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
    const content = (await AboutContent.findOne().lean()) as LeanAboutContent;

    if (!content) {
      return NextResponse.json({}, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    // Convert _id to string
    return NextResponse.json({
      content: {
        ...content,
        _id: content._id.toString(),
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    );
  }
}
