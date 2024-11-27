import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AlbumNotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold">Photo not found</h2>
        <p className="text-muted-foreground">We couldn&apos;t find the photo you&apos;re looking for.</p>
        <Link href="/photos">
          <Button>
            Return to Albums
          </Button>
        </Link>
      </div>
    </main>
  );
}
