import Link from 'next/link';

export default function PhotoNotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Photo Not Found</h1>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t find the photo you&apos;re looking for.
        </p>
        <Link
          href="/photos"
          className="btn btn-primary"
        >
          Back to Gallery
        </Link>
      </div>
    </main>
  );
}
