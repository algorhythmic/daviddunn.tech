'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BlogPost } from '@/types/schema';
import { Card, CardContent } from '@/components/ui/card';
import MDEditor from '@uiw/react-md-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

interface EditBlogFormProps {
  post: BlogPost;
}

export default function EditBlogForm({ post }: EditBlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    category: post.category,
    tags: post.tags,
    status: post.status,
    featuredImage: null as File | null,
  });
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          submitData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== null) {
          submitData.append(key, String(value));
        }
      });

      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        body: submitData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update blog post');
      }

      toast({
        title: 'Success!',
        description: 'Blog post updated successfully.',
      });

      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update blog post',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-secondary-foreground/60 hover:text-secondary-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Input
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="featuredImage">Featured Image</Label>
          {post.featuredImage && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <Image
                  src={post.featuredImage}
                  alt="Current featured image"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </CardContent>
            </Card>
          )}
          {previewImage && (
            <div className="relative w-full h-[200px] mb-4">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <Input
            id="featuredImage"
            name="featuredImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="grid gap-2">
          <Label>Content</Label>
          <Card>
            <CardContent className="p-4">
              <MDEditor
                value={formData.content}
                onChange={handleContentChange}
                preview="edit"
                height={400}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/blog')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
