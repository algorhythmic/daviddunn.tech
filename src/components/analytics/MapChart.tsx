'use client';

import { useEffect, useRef, useState } from 'react';
import L, { LatLngTuple } from 'leaflet';
import { useTheme } from 'next-themes';
import 'leaflet/dist/leaflet.css';

interface Marker {
  name: string;
  coordinates: LatLngTuple;
  value: number;
}

const markers: Marker[] = [
  { name: "San Francisco", coordinates: [37.7749, -122.4194], value: 500 },
  { name: "New York", coordinates: [40.7128, -74.0060], value: 300 },
  { name: "London", coordinates: [51.5074, -0.1276], value: 200 },
  { name: "Tokyo", coordinates: [35.6895, 139.6917], value: 150 },
];

const LIGHT_THEME = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DARK_THEME = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function useMap(containerId: string) {
  const mapRef = useRef<L.Map | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { theme } = useTheme();
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map(containerId, {
        center: [20, 0],
        zoom: 1,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      });

      tileLayerRef.current = L.tileLayer(theme === 'dark' ? DARK_THEME : LIGHT_THEME, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 2,
        minZoom: 1
      }).addTo(map);

      markers.forEach(({ name, coordinates, value }) => {
        const circle = L.circleMarker(coordinates, {
          radius: 4,
          fillColor: "#10b981", // Tailwind emerald-500
          color: "#059669", // Tailwind emerald-600
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6
        }).addTo(map);

        circle.bindPopup(`${name}: ${value} visitors`);
      });

      mapRef.current = map;
      setIsReady(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, [containerId, theme]); // Added theme to dependencies

  // Update tile layer when theme changes
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = L.tileLayer(theme === 'dark' ? DARK_THEME : LIGHT_THEME, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 2,
        minZoom: 1
      }).addTo(mapRef.current);
    }
  }, [theme]);

  return isReady;
}

export function MapChart() {
  const containerId = 'map';
  const isMapReady = useMap(containerId);
  const { theme } = useTheme();

  return (
    <div 
      id={containerId} 
      style={{ 
        height: '100px', 
        width: '100%', 
        background: theme === 'dark' ? '#242424' : '#f8f9fa',
        minHeight: '100px'
      }}
    >
      {!isMapReady && (
        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
          Loading map...
        </div>
      )}
    </div>
  );
}
