import { NextRequest, NextResponse } from 'next/server'
import { testPhotos, testPosts } from '@/data/testData'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  // Search through photos
  const photoResults = testPhotos.filter(photo => 
    photo.title.toLowerCase().includes(query) ||
    photo.description.toLowerCase().includes(query) ||
    (photo.category?.toLowerCase().includes(query) || false) ||
    photo.tags.some(tag => tag.toLowerCase().includes(query))
  ).map(photo => ({
    type: 'photo' as const,
    item: photo
  }))

  // Search through blog posts
  const blogResults = testPosts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.excerpt.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  ).map(post => ({
    type: 'blog' as const,
    item: post
  }))

  const results = [
    ...photoResults,
    ...blogResults,
  ]

  return NextResponse.json({ results })
}
