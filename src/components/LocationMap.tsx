import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapEventsProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const MapEvents = ({ onLocationSelect }: MapEventsProps) => {
  useMapEvents({
    click: async (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        onLocationSelect(lat, lng, data.display_name);
      } catch (error) {
        console.error('Error getting address:', error);
        onLocationSelect(lat, lng, 'Address not found');
      }
    },
  });
  return null;
};

interface LocationMapProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

export default function LocationMap({ lat, lng, onLocationSelect }: LocationMapProps) {
  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <MapContainer
        center={{ lat, lng }}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker 
          position={{ lat, lng }}
          icon={icon}
        />
        <MapEvents onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
