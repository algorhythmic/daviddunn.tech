'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search as SearchIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({ className, placeholder = 'Search...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsExpanded(false);
  };

  // Handle escape key to collapse search
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClear();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        'relative flex items-center transition-all duration-300',
        isExpanded ? 'w-full md:w-96' : 'w-10',
        className
      )}
    >
      <Input
        type="search"
        placeholder={isExpanded ? placeholder : ''}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        className={cn(
          'pr-20 transition-all duration-300',
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
        </Button>
      </div>
    </form>
  );
}
