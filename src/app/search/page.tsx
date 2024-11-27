'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IPhoto, BlogPost } from '@/types/schema'
import PhotoCard from '@/components/PhotoCard'
import BlogCard from '@/components/BlogCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SearchResult {
  type: 'photo' | 'blog'
  item: IPhoto | BlogPost
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    async function performSearch() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/search?q=' + encodeURIComponent(query || ''))
        if (!response.ok) {
          throw new Error('Search request failed')
        }
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Search failed:', error)
        setError('Failed to perform search. Please try again.')
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
      <h1 className="text-4xl font-bold mb-8">Search Results for &quot;{query}&quot;</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
              {results.map((result) => {
                if (result.type === 'photo' && 'id' in result.item) {
                  return <PhotoCard key={`photo-${result.item.id}`} photo={result.item as unknown as IPhoto} />
                }
                if (result.type === 'blog' && 'id' in result.item) {
                  return <BlogCard key={`blog-${result.item.id}`} post={result.item as BlogPost} />
                }
                return null
              })}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photoResults.map((result) => (
                'id' in result.item && 
                <PhotoCard key={`photo-${result.item.id}`} photo={result.item as unknown as IPhoto} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogResults.map((result) => (
                'id' in result.item && 
                <BlogCard key={`blog-${result.item.id}`} post={result.item as BlogPost} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <p className="text-sm text-muted-foreground">
          No results found for &quot;{query}&quot;
        </p>
      )}
    </div>
  )
}
