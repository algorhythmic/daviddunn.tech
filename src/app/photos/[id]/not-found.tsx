import Link from 'next/link';

export default function PhotoNotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Photo Not Found</h1>
        <p className="text-gray-600 mb-8">
          The photo you're looking for could not be found. It may have been removed or the URL might be incorrect.
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
