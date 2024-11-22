'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/blog', icon: FileText, label: 'Blog Posts' },
    { href: '/admin/photos', icon: ImageIcon, label: 'Photos' },
    { href: '/admin/about', icon: User, label: 'About' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r fixed h-full">
        <div className="h-full flex flex-col">
          {/* Logo and Return Button */}
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <Link href="/admin" className="text-xl font-bold hover:text-primary">
              Admin
            </Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Site
              </Link>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href + '/') || pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 w-full">
        <div className="container py-6 px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
