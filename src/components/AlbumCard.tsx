'use client';

import { Album } from '@/types/schema';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/photos/albums/${album._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={album.coverPhotoUrl}
              alt={album.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{album.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {album.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span>{album.photoCount} photos</span>
            {album.location && (
              <>
                <span>•</span>
                <span>{album.location}</span>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {album.keywords.slice(0, 3).map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
            {album.keywords.length > 3 && (
              <Badge variant="secondary">+{album.keywords.length - 3}</Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
