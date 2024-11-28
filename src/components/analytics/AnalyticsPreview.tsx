'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapChart } from './MapChart';

interface AnalyticsPreviewProps {
  data?: {
    latitude: number;
    longitude: number;
    name?: string;
    value?: number;
  }[];
}

export default function AnalyticsPreview({ data }: AnalyticsPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <MapChart data={data} />
      </CardContent>
    </Card>
  );
}
