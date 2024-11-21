'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsExpanded(false)
  }

  // Handle escape key to collapse search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClear()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Handle click outside to collapse search
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('form')) {
        handleClear()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isExpanded])

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        'relative flex items-center transition-all duration-300',
        isExpanded ? 'w-full md:w-80' : 'w-10',
        className
      )}
    >
      <Input
        type="search"
        placeholder={isExpanded ? 'Search photos, blog posts...' : ''}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        className={cn(
          'pr-20 transition-all duration-300 h-9',
          !isExpanded && 'w-10 px-0 border-none bg-transparent'
        )}
      />
      
      <div className="absolute right-0 flex items-center gap-1">
        {isExpanded && query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <Button
          type={isExpanded ? 'submit' : 'button'}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}
