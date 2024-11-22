'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FullLineChart } from '@/components/analytics/charts/FullLineChart';
import { FullMapChart } from '@/components/analytics/charts/FullMapChart';
import { PopularPagesChart } from '@/components/analytics/charts/PopularPagesChart';

export default function AnalyticsDashboard() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="pb-4">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Track website performance and visitor engagement metrics.
          </p>
        </div>

        {/* Visitor Overview */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm">Average Time</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-bold">2m 45s</div>
              <p className="text-xs text-muted-foreground">-5% from last month</p>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm">Page Views</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-2xl font-bold">3,456</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <FullLineChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Visitor Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <FullMapChart />
            </CardContent>
          </Card>
        </div>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <PopularPagesChart />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
