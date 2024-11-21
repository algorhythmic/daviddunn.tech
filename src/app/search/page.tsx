'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Photo, BlogPost } from '@/types/schema'
import PhotoCard from '@/components/PhotoCard'
import BlogCard from '@/components/BlogCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchResult {
  type: 'photo' | 'blog'
  item: Photo | BlogPost
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    async function performSearch() {
      setLoading(true)
      try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query || ''))
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search failed:', error)
        setResults([])
      }
      setLoading(false)
    }

    if (query) {
      performSearch()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query])

  const photoResults = results.filter(result => result.type === 'photo')
  const blogResults = results.filter(result => result.type === 'blog')

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Search</h1>
        <p className="text-muted-foreground">Please enter a search query</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search Results for "{query}"</h1>
      
      {loading ? (
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : results.length > 0 ? (
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">
              All Results ({results.length})
            </TabsTrigger>
            <TabsTrigger value="photos">
              Photos ({photoResults.length})
            </TabsTrigger>
            <TabsTrigger value="blog">
              Blog Posts ({blogResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result, index) => {
                if (result.type === 'photo') {
                  return <PhotoCard key={`photo-${index}`} photo={result.item as Photo} />
                }
                if (result.type === 'blog') {
                  return <BlogCard key={`blog-${index}`} post={result.item as BlogPost} />
                }
                return null
              })}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photoResults.map((result, index) => (
                <PhotoCard key={index} photo={result.item as Photo} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogResults.map((result, index) => (
                <BlogCard key={index} post={result.item as BlogPost} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <p className="text-muted-foreground">No results found for "{query}"</p>
      )}
    </div>
  )
}
