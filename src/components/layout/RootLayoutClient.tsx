'use client';

import { NavHeader } from '@/components/layout/NavHeader';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import TechFooter from '@/components/TechFooter';

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps): JSX.Element {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && <NavHeader />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminPage && <TechFooter />}
    </div>
  );
}
