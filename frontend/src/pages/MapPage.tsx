import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, SlidersHorizontal, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { PotholeDetection } from '../types';

// Custom Leaflet Pin Icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${color};
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 12px ${color};
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const iconCritical = createCustomIcon('#DC2626');
const iconHigh = createCustomIcon('#EF4444');
const iconMedium = createCustomIcon('#F59E0B');
const iconLow = createCustomIcon('#10B981');

export const MapPage: React.FC = () => {
  const [detections, setDetections] = useState<PotholeDetection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  useEffect(() => {
    api.listDetections()
      .then((res) => setDetections(res.data))
      .catch((err) => console.error("Failed to load map detections", err))
      .finally(() => setLoading(false));
  }, []);

  const geolocated = detections.filter(
    (d) => d.latitude !== null && d.longitude !== null && (severityFilter === 'ALL' || d.severity === severityFilter)
  );

  const defaultCenter: [number, number] = geolocated.length > 0
    ? [geolocated[0].latitude!, geolocated[0].longitude!]
    : [37.7749, -122.4194]; // San Francisco default

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-cyan-glow" />
            <span>Interactive Geospatial Pothole Map</span>
          </h1>
          <p className="text-xs text-slate-400">
            OpenStreetMap & Leaflet interactive map rendering geolocated hazards matched with GPX tracks.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[600px] w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 relative shadow-2xl">
        <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {geolocated.map((det) => {
            const icon = det.severity === 'CRITICAL' ? iconCritical
              : det.severity === 'HIGH' ? iconHigh
              : det.severity === 'MEDIUM' ? iconMedium
              : iconLow;

            return (
              <Marker key={det.id} position={[det.latitude!, det.longitude!]} icon={icon}>
                <Popup>
                  <div className="space-y-2 p-1 text-xs font-sans">
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-cyan-400">{det.severity} HAZARD</span>
                      <span className="text-white">{(det.confidence * 100).toFixed(0)}% Conf</span>
                    </div>
                    <p className="text-slate-200">{det.notes || 'Pothole detected on road surface'}</p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-700">
                      Coordinates: {det.latitude?.toFixed(5)}, {det.longitude?.toFixed(5)}
                    </div>
                    {det.speed_kmh && (
                      <div className="text-[10px] font-mono text-amber-400">
                        Vehicle Speed: {det.speed_kmh} km/h
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Legend Box */}
        <div className="absolute bottom-4 right-4 z-[1000] glass-panel p-3 rounded-xl border border-white/10 space-y-1.5 text-xs">
          <p className="font-mono text-[11px] font-bold text-cyan-glow uppercase">Map Hazard Legend</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span className="text-slate-300">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
