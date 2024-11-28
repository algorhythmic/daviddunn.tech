'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from 'leaflet';

// Sample visitor data with locations and counts
const visitorData = [
  { lat: 51.5074, lng: -0.1278, count: 150 }, // London
  { lat: 40.7128, lng: -74.0060, count: 200 }, // New York
  { lat: 35.6762, lng: 139.6503, count: 120 }, // Tokyo
  { lat: 37.7749, lng: -122.4194, count: 180 }, // San Francisco
  { lat: 48.8566, lng: 2.3522, count: 90 }, // Paris
  { lat: -33.8688, lng: 151.2093, count: 70 }, // Sydney
  { lat: 52.5200, lng: 13.4050, count: 110 }, // Berlin
  { lat: 55.7558, lng: 37.6173, count: 60 }, // Moscow
  { lat: 19.4326, lng: -99.1332, count: 85 }, // Mexico City
  { lat: -23.5505, lng: -46.6333, count: 95 }, // São Paulo
  { lat: 1.3521, lng: 103.8198, count: 75 }, // Singapore
  { lat: 25.2048, lng: 55.2708, count: 130 }, // Dubai
];

function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const leafletMap = useRef<LeafletMap | null>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  // Initialize Leaflet
  useEffect(() => {
    const initLeaflet = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      setLeaflet(L);
    };
    initLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapRef.current || leafletMap.current) return;

    leafletMap.current = leaflet.map(mapRef.current, {
      center: [20, 0],
      zoom: 1,
      zoomControl: true,
      attributionControl: true,
    });

    // Function to get color and size based on visitor count
    const getMarkerStyle = (count: number) => {
      const maxCount = Math.max(...visitorData.map(d => d.count));
      const minCount = Math.min(...visitorData.map(d => d.count));
      const ratio = (count - minCount) / (maxCount - minCount);
      
      // Color interpolation from blue to green
      const blue = [59, 130, 246]; // rgb(59, 130, 246) - blue-500
      const green = [34, 197, 94]; // rgb(34, 197, 94) - green-500
      
      const color = blue.map((start, i) => {
        const end = green[i];
        return Math.round(start + (end - start) * ratio);
      });

      return {
        color: `rgb(${color.join(',')})`,
        radius: 20000 + (ratio * 40000), // Size between 20-60km
      };
    };

    // Add tile layer
    leaflet.tileLayer(
      theme === 'dark'
        ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          theme === 'dark'
            ? '&copy; <a href="https://carto.com/">CARTO</a>'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }
    ).addTo(leafletMap.current);

    // Add markers for each location
    visitorData.forEach(({ lat, lng, count }) => {
      const { color, radius } = getMarkerStyle(count);
      leaflet.circle([lat, lng], {
        color,
        fillColor: color,
        fillOpacity: 0.5,
        radius,
      })
        .addTo(leafletMap.current!)
        .bindPopup(`Visitors: ${count}`);
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [leaflet, theme]);

  return <div ref={mapRef} className="w-full h-[500px] rounded-lg" />;
}

export const FullMapChart = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
});
