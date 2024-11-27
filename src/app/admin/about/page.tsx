import { Metadata } from 'next';
import { AboutContentForm } from '@/components/admin/AboutContentForm';
import { connectToMongoDB } from '@/lib/db';
import { AboutContent } from '@/models/about';
import { Types } from 'mongoose';

export const metadata: Metadata = {
  title: 'Admin - About Page Content',
  description: 'Manage About page content and uploads',
};

type LeanAboutContent = {
  _id: Types.ObjectId;
  statement?: string;
  resumeUrl?: string;
  previewImages?: {
    resume?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  socialLinks?: {
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  lastUpdated?: Date;
};

async function getAboutContent() {
  try {
    await connectToMongoDB();
    const content = await AboutContent.findOne().lean() as LeanAboutContent;
    
    if (!content) {
      return null;
    }

    // Serialize the MongoDB document to a plain object
    const serializedContent = {
      _id: content._id.toString(),
      statement: content.statement || '',
      resumeUrl: content.resumeUrl || '',
      previewImages: {
        resume: content.previewImages?.resume || '',
        linkedin: content.previewImages?.linkedin || '',
        github: content.previewImages?.github || '',
        instagram: content.previewImages?.instagram || ''
      },
      socialLinks: {
        linkedin: content.socialLinks?.linkedin || '',
        github: content.socialLinks?.github || '',
        instagram: content.socialLinks?.instagram || ''
      },
      lastUpdated: content.lastUpdated ? content.lastUpdated.toISOString() : new Date().toISOString()
    };

    return serializedContent;
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

export default async function AdminAboutPage() {
  const content = await getAboutContent();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">About Page Content</h1>
        </div>
        <AboutContentForm initialContent={content} />
      </div>
    </div>
  );
}
