import { NextRequest, NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/db'
import Photo from '@/models/mongodb/Photo'
import BlogPost from '@/models/mongodb/BlogPost'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')?.toLowerCase()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    await connectToMongoDB()

    // Search through photos
    const photos = await Photo.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ]
    }).lean()

    const photoResults = photos.map(photo => ({
      type: 'photo' as const,
      item: photo
    }))

    // Search through blog posts
    const posts = await BlogPost.find({
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ]
    }).lean()

    const blogResults = posts.map(post => ({
      type: 'blog' as const,
      item: post
    }))

    const results = [
      ...photoResults,
      ...blogResults,
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
