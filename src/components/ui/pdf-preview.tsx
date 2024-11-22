import { useState } from 'react';
import Image from 'next/image';

interface PDFPreviewProps {
  url: string;
  width?: number;
}

export function PDFPreview({ url, width = 200 }: PDFPreviewProps) {
  const [error, setError] = useState<Error | null>(null);

  return (
    <div className="pdf-preview relative w-full aspect-[3/4] bg-muted rounded-md overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-16 h-16 relative">
          <Image
            src="/icons/pdf-icon.svg"
            alt="PDF document"
            width={64}
            height={64}
            className="text-foreground"
          />
        </div>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline flex items-center space-x-2"
        >
          <span>View Resume</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
