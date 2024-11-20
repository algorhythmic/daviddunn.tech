"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface TableOfContentsProps {
  headings: { id: string; text: string; level: number }[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [headings])

  return (
    <div className="hidden lg:block">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-64 fixed right-8 top-20 space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">On this page</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-90"
                )}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                'block text-sm transition-colors hover:text-foreground/80',
                activeId === id
                  ? 'text-foreground'
                  : 'text-foreground/60',
                level === 2 ? 'pl-4' : 'pl-8'
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
            >
              {text}
            </a>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
