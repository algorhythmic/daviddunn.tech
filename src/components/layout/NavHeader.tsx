'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { SearchBar } from '@/components/layout/SearchBar';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { 
  Home,
  BookOpen,
  Camera,
  BarChart,
  User,
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Photos', href: '/photos', icon: Camera },
  { name: 'About', href: '/about', icon: User },
];

export function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when the pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/images/profile.svg" alt="David Dunn" />
                    <AvatarFallback className="bg-cyan-600 text-white">DD</AvatarFallback>
                  </Avatar>
                </div>
              </SheetHeader>
              <nav className="flex flex-col mt-8">
                {navigation.map((item, index) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-foreground/60 transition-colors hover:text-foreground/80 text-lg flex items-center py-4 pl-4"
                    >
                      <item.icon className="h-5 w-5 mr-4" />
                      <span>{item.name}</span>
                    </Link>
                    {index < navigation.length - 1 && (
                      <Separator className="my-0" />
                    )}
                  </div>
                ))}
              </nav>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <SocialLinks iconClassName="h-5 w-5" />
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
            <span className="font-bold">David Dunn</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchBar />
          </div>
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
