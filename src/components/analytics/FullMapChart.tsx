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
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
      });

      // Add some sample markers
      L.circleMarker([51.5074, -0.1278], { // London
        radius: 8,
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.8,
      }).addTo(leafletMap.current);

      L.circleMarker([40.7128, -74.0060], { // New York
        radius: 8,
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.8,
      }).addTo(leafletMap.current);

      L.circleMarker([35.6762, 139.6503], { // Tokyo
        radius: 8,
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.8,
      }).addTo(leafletMap.current);
    }

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
    leafletMap.current.setView([20, 0], 2);

  }, [theme, mapRef]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-sm overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
}
