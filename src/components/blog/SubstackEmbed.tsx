'use client';

import { useEffect, useRef, useState } from 'react';

interface SubstackEmbedProps {
  iframeUrl: string;
  initialHeight?: number;
  title: string;
}

export default function SubstackEmbed({ iframeUrl, initialHeight = 500, title }: SubstackEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://substackapi.com') return;

      try {
        const data = JSON.parse(event.data);
        if (data.type === 'resize' && data.height) {
          setHeight(data.height);
        }
      } catch (error) {
        console.error('Error parsing Substack message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        width="100%"
        height={height}
        style={{ border: '1px solid #EEE', background: 'white' }}
        frameBorder="0"
        scrolling="no"
        title={title}
        className="mx-auto max-w-full"
        loading="lazy"
      />
    </div>
  );
}
