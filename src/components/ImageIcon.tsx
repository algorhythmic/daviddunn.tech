import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export default function ImageIconComponent({ className }: Props) {
  return (
    <ImageIcon className={cn('h-12 w-12 text-gray-400', className)} />
  );
}
