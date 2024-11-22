import { Metadata } from 'next';
import { AboutContentForm } from '@/components/admin/AboutContentForm';
import { connectToMongoDB } from '@/lib/db';
import { AboutContent, IAboutContent } from '@/models/about';

export const metadata: Metadata = {
  title: 'Admin - About Page Content',
  description: 'Manage About page content and uploads',
};

async function getAboutContent() {
  try {
    await connectToMongoDB();
    const content = await AboutContent.findOne().lean() as IAboutContent;
    return content;
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
