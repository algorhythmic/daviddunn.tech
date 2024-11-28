import { Metadata } from 'next';
import NewBlogForm from '@/components/admin/NewBlogForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'New Blog Post | Admin',
  description: 'Create a new blog post',
};

export default async function NewBlogPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create New Blog Post</h1>
        <NewBlogForm />
      </div>
    </div>
  );
}
