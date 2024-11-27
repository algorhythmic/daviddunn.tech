import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AlbumNotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Album Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The photo album you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/photos">
          <Button>
            Return to Albums
          </Button>
        </Link>
      </div>
    </main>
  );
}
