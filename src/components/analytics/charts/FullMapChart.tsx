'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function FullMapChart() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 1,
        zoomControl: true,
        attributionControl: true,
      });
    }

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

    // Function to get color and size based on visitor count
    const getMarkerStyle = (count: number) => {
      const maxCount = Math.max(...visitorData.map(d => d.count));
      const minCount = Math.min(...visitorData.map(d => d.count));
      const ratio = (count - minCount) / (maxCount - minCount);
      
      // Color interpolation from blue to green
      const blue = [59, 130, 246]; // rgb(59, 130, 246) - blue-500
      const green = [34, 197, 94]; // rgb(34, 197, 94) - green-500
      
      const color = blue.map((start, i) => 
        Math.round(start + (green[i] - start) * ratio)
      );
      
      // Size interpolation from 6 to 12
      const size = 6 + (ratio * 6);
      
      return {
        color: `rgb(${color.join(',')})`,
        radius: size,
      };
    };

    // Remove existing markers
    leafletMap.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        leafletMap.current?.removeLayer(layer);
      }
    });

    // Add markers for each location
    visitorData.forEach(({ lat, lng, count }) => {
      const style = getMarkerStyle(count);
      L.circleMarker([lat, lng], {
        radius: style.radius,
        color: style.color,
        fillColor: style.color,
        fillOpacity: 0.8,
      }).addTo(leafletMap.current!);
    });

    // Update tile layer based on theme
    const tileLayer = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    // Remove existing tile layers
    leafletMap.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        leafletMap.current?.removeLayer(layer);
      }
    });

    // Add new tile layer
    L.tileLayer(tileLayer, {
      maxZoom: 18,
      minZoom: 1,
    }).addTo(leafletMap.current);

    // Invalidate size and recenter
    leafletMap.current.invalidateSize();
    leafletMap.current.setView([20, 0], 1);

  }, [theme, mapRef]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-sm overflow-hidden"
      style={{ height: '400px' }}
    />
  );
}
