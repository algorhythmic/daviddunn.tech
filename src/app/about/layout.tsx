import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | David Dunn',
  description: 'Learn more about David Dunn and his professional background.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
