import { NextResponse, NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db';
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
    
    // Extract data from FormData
    const statement = formData.get('statement') as string;
    const resumeUrl = formData.get('resumeUrl') as string;
    
    // Extract preview images
    const previewImages = {
      resume: formData.get('previewImages[resume]') as string,
      linkedin: formData.get('previewImages[linkedin]') as string,
      github: formData.get('previewImages[github]') as string,
      instagram: formData.get('previewImages[instagram]') as string,
    };
    
    // Extract social links
    const socialLinks = {
      linkedin: formData.get('socialLinks[linkedin]') as string,
      github: formData.get('socialLinks[github]') as string,
      instagram: formData.get('socialLinks[instagram]') as string,
    };

    await connectToDatabase();

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
          previewImages,
          socialLinks,
          lastUpdated: new Date(),
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: false,
        lean: true
      }
    )) as LeanAboutContent;

    if (!content) {
      console.error('No content returned after update');
      throw new Error('Failed to update content');
    }

    // Return the updated content with string _id
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
    await connectToDatabase();
    const content = (await AboutContent.findOne().lean()) as LeanAboutContent;

    if (!content) {
      return NextResponse.json({
        content: null
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    // Return the content with string _id
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
