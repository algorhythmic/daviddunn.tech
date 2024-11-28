'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

interface Marker {
  name: string;
  coordinates: [number, number];
  value: number;
}

const markers: Marker[] = [
  { name: "San Francisco", coordinates: [37.7749, -122.4194], value: 500 },
  { name: "New York", coordinates: [40.7128, -74.0060], value: 300 },
  { name: "London", coordinates: [51.5074, -0.1276], value: 200 },
  { name: "Tokyo", coordinates: [35.6895, 139.6917], value: 150 },
];

const LIGHT_THEME = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DARK_THEME = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';

const MapComponent = () => {
  const mapRef = useRef<any>(null);
  const { theme } = useTheme();
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const L = require('leaflet');
    require('leaflet/dist/leaflet.css');

    if (!mapRef.current) {
      const instance = L.map('map').setView([20, 0], 2);
      
      L.tileLayer(theme === 'dark' ? DARK_THEME : LIGHT_THEME, {
        attribution: theme === 'dark' 
          ? '&copy; <a href="https://carto.com/">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(instance);

      markers.forEach(marker => {
        L.circle(marker.coordinates, {
          color: theme === 'dark' ? '#fff' : '#000',
          fillColor: theme === 'dark' ? '#fff' : '#000',
          fillOpacity: 0.5,
          radius: marker.value * 100
        }).addTo(instance)
         .bindPopup(`${marker.name}: ${marker.value} visits`);
      });

      setMap(instance);
      mapRef.current = instance;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [theme]);

  useEffect(() => {
    if (map) {
      const tileLayer = L.tileLayer(theme === 'dark' ? DARK_THEME : LIGHT_THEME, {
        attribution: theme === 'dark' 
          ? '&copy; <a href="https://carto.com/">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      });

      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      tileLayer.addTo(map);
    }
  }, [theme, map]);

  return <div id="map" className="w-full h-[400px] rounded-lg" />;
};

// Dynamically import the Map component with no SSR
const MapChart = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
});

export default MapChart;
