"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SocialLinks } from '@/components/layout/SocialLinks'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Photos', href: '/photos' },
  { name: 'Apps', href: '/apps' },
  { name: 'About', href: '/about' },
]

export function NavHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/images/profile.svg" alt="David Dunn" />
              <AvatarFallback className="bg-cyan-600 text-white">DD</AvatarFallback>
            </Avatar>
            <span className="font-bold">David Dunn</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader className="space-y-4 pb-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/images/profile.svg" alt="David Dunn" />
                  <AvatarFallback className="bg-cyan-600 text-white text-xl">DD</AvatarFallback>
                </Avatar>
                <SheetTitle className="text-lg">David Dunn</SheetTitle>
              </div>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <SocialLinks iconClassName="h-5 w-5" />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search functionality here later */}
          </div>
          <nav className="flex items-center space-x-2">
            <SocialLinks />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
