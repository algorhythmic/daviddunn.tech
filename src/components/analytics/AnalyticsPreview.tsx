'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LineChart } from './LineChart';
import MapChart from './MapChart';

export function AnalyticsPreview() {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center justify-between">
          Site Analytics
          <Link 
            href="/analytics" 
            className="text-sm font-normal text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-1">
              <CardTitle className="text-xs font-medium">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-base font-bold">1,234</div>
              <p className="text-[10px] text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-1">
              <CardTitle className="text-xs font-medium">Average Time</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-base font-bold">2m 45s</div>
              <p className="text-[10px] text-muted-foreground">-5% from last month</p>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-1">
              <CardTitle className="text-xs font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-base font-bold">3,456</div>
              <p className="text-[10px] text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-2 md:grid-cols-2">
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-1">
              <CardTitle className="text-xs font-medium">Monthly Visitors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[120px]">
                <LineChart />
              </div>
            </CardContent>
          </Card>
          <Card className="p-2">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-1">
              <CardTitle className="text-xs font-medium">Visitor Locations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[120px] relative">
                <MapChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
