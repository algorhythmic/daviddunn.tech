'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import type L from 'leaflet';
import type { Map as LeafletMap, TileLayer } from 'leaflet';

interface MapChartProps {
  data?: Array<{
    latitude: number;
    longitude: number;
    name?: string;
    value?: number;
  }>;
}

const LIGHT_THEME = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DARK_THEME = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';

function MapChartComponent({ data = [] }: MapChartProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const { theme } = useTheme();
  const [leaflet, setLeaflet] = useState<typeof L | null>(null);

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
    if (!leaflet || mapRef.current) return;

    const instance = leaflet.map('map', {
      scrollWheelZoom: false,
      dragging: false,
      zoomControl: false,
      minZoom: 1,
      maxZoom: 1
    }).setView([20, 0], 1);

    tileLayerRef.current = leaflet.tileLayer(theme === 'dark' ? DARK_THEME : LIGHT_THEME, {
      attribution: theme === 'dark' 
        ? '&copy; <a href="https://carto.com/">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(instance);

    data.forEach(marker => {
      leaflet.circle([marker.latitude, marker.longitude], {
        color: theme === 'dark' ? '#fff' : '#000',
        fillColor: theme === 'dark' ? '#fff' : '#000',
        fillOpacity: 0.5,
        radius: (marker.value || 1) * 100
      }).addTo(instance)
       .bindPopup(`${marker.name || 'Location'}: ${marker.value || 1} visits`);
    });

    mapRef.current = instance;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [leaflet, data, theme]);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!leaflet || !mapRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.remove();
    tileLayerRef.current = leaflet.tileLayer(theme === 'dark' ? DARK_THEME : LIGHT_THEME, {
      attribution: theme === 'dark' 
        ? '&copy; <a href="https://carto.com/">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(mapRef.current);
  }, [leaflet, theme]);

  return (
    <div id="map" className="w-full h-[400px]" />
  );
}

export const MapChart = dynamic(() => Promise.resolve(MapChartComponent), {
  ssr: false,
});
