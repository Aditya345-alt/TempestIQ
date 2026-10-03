import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Circle,
  Polyline,
  Polygon,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Radio,
  CloudLightning,
  AlertTriangle,
  MapPin,
  Maximize2,
  Navigation,
  Sparkles,
  Wind,
  Plus,
  Minus,
  Crosshair,
  Compass,
} from 'lucide-react';
import type {
  RadarStation,
  RadarCompositeFrame,
  ObservedStrike,
  TrackedStorm,
  RiskZone,
  LayerVisibility,
} from '../types/indiaMap';
import type { InspectorItem } from '../components/map/LocationDetailPanel';

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Radar Station Icon
const createRadarIcon = (status: string) => {
  const isOp = status === 'OPERATIONAL';
  return L.divIcon({
    className: 'custom-radar-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${isOp ? '#00D5E5' : '#FF9F43'}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 16px; height: 16px; border-radius: 50%; background: #061418; border: 1.8px solid ${isOp ? '#00D5E5' : '#FF9F43'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px ${isOp ? '#00D5E5' : '#FF9F43'};">
          <div style="width: 5px; height: 5px; border-radius: 50%; background: ${isOp ? '#00D5E5' : '#FF9F43'};"></div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Custom Storm / Cyclone / Tornado Marker Icon
const createStormIcon = (severity: string, stormType?: string) => {
  if (stormType === 'CYCLONE') {
    return L.divIcon({
      className: 'custom-cyclone-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; inset: 0; border-radius: 50%; border: 2px dashed #00f0ff; animation: cyclone-spin-ccw 8s linear infinite; opacity: 0.8; box-shadow: 0 0 16px rgba(0, 240, 255, 0.6);"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: radial-gradient(circle, #082226 40%, #00d5e5 100%); border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 14px #00f0ff;">
            🌀
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }

  if (stormType === 'TORNADO') {
    return L.divIcon({
      className: 'custom-tornado-marker',
      html: `
        <div class="tornado-funnel-animated" style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
          <div style="width: 30px; height: 30px; border-radius: 50%; background: #190e08; border: 2px solid #ff4d4d; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 0 15px #ef4444;">
            🌪️
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }

  const color = severity === 'EXTREME' ? '#A855F7' : severity === 'SEVERE' ? '#FF4D4D' : '#FF9F43';
  return L.divIcon({
    className: 'custom-storm-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 20px; height: 20px; border-radius: 50%; background: #061418; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px ${color};">
          <div style="width: 7px; height: 7px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Weather Condition Badge Icons (Rain, Thunder, Cyclone, Tornado)
const createWeatherBadgeIcon = (
  type: 'RAIN' | 'THUNDER' | 'CYCLONE' | 'TORNADO',
  title: string,
  metric: string
) => {
  let iconSvg = '';
  let badgeBorder = '#00d5e5';
  let badgeBg = 'rgba(6, 20, 24, 0.9)';
  let accentColor = '#00f0ff';

  if (type === 'RAIN') {
    badgeBorder = '#00e5ff';
    accentColor = '#38bdf8';
    iconSvg = `
      <div style="display: flex; align-items: center; gap: 4px;">
        <span style="font-size: 15px;">🌧️</span>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span class="raindrop-particle" style="width: 2px; height: 5px; background: #38bdf8; border-radius: 2px;"></span>
        </div>
      </div>
    `;
  } else if (type === 'THUNDER') {
    badgeBorder = '#ffd700';
    accentColor = '#facc15';
    badgeBg = 'rgba(25, 20, 6, 0.92)';
    iconSvg = `
      <div style="display: flex; align-items: center; gap: 3px;">
        <span style="font-size: 15px;" class="lightning-spark-ping">⛈️</span>
        <span style="color: #ffd700; font-weight: bold; font-size: 12px;">⚡</span>
      </div>
    `;
  } else if (type === 'CYCLONE') {
    badgeBorder = '#00f0ff';
    accentColor = '#22d3ee';
    badgeBg = 'rgba(4, 18, 22, 0.94)';
    iconSvg = `<span style="font-size: 16px; display: inline-block; animation: cyclone-spin-ccw 6s linear infinite;">🌀</span>`;
  } else if (type === 'TORNADO') {
    badgeBorder = '#f97316';
    accentColor = '#fb923c';
    badgeBg = 'rgba(28, 12, 6, 0.92)';
    iconSvg = `<span style="font-size: 16px;" class="tornado-funnel-animated">🌪️</span>`;
  }

  return L.divIcon({
    className: 'custom-weather-badge',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 9px;
        background: ${badgeBg};
        backdrop-filter: blur(10px);
        border: 1.5px solid ${badgeBorder};
        border-radius: 9999px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.75), 0 0 12px ${accentColor}40;
        white-space: nowrap;
        pointer-events: auto;
        cursor: pointer;
        font-family: 'Space Grotesk', -apple-system, sans-serif;
        transition: transform 0.2s ease;
      ">
        ${iconSvg}
        <div style="display: flex; flex-direction: column; line-height: 1.1;">
          <span style="font-size: 10px; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">${title}</span>
          <span style="font-size: 9px; font-family: 'JetBrains Mono', monospace; color: ${accentColor}; font-weight: 600;">${metric}</span>
        </div>
      </div>
    `,
    iconSize: [160, 32],
    iconAnchor: [80, 16],
  });
};

// Dim, Eye-Comfortable Lightning Pinprick Icon (Soft subtle warm amber, no harsh glare)
const createLightningSparkIcon = (strikeType: 'CG' | 'IC', peakCurrent: number) => {
  const isCg = strikeType === 'CG';
  const size = isCg ? 4.5 : 3.0;
  return L.divIcon({
    className: 'custom-lightning-spark',
    html: `
      <div class="lightning-spark-dim" style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #fef08a;
        box-shadow: 0 0 2px rgba(254, 240, 138, 0.4);
        opacity: 0.65;
        pointer-events: none;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// State Label Icon matching exact reference image typography
const createStateLabelIcon = (name: string) => {
  return L.divIcon({
    className: 'state-map-label',
    html: `
      <div style="
        font-family: 'Space Grotesk', -apple-system, sans-serif;
        font-size: 11px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.92);
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.95), 0 0 8px rgba(0, 0, 0, 0.85);
        white-space: nowrap;
        pointer-events: none;
        letter-spacing: 0.02em;
        text-align: center;
      ">
        ${name}
      </div>
    `,
    iconSize: [130, 18],
    iconAnchor: [65, 9],
  });
};

// Country Label Icon (All-Caps Bold Muted)
const createCountryLabelIcon = (name: string) => {
  return L.divIcon({
    className: 'country-map-label',
    html: `
      <div style="
        font-family: 'Space Grotesk', -apple-system, sans-serif;
        font-size: 12px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.65);
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.8);
        white-space: nowrap;
        pointer-events: none;
        letter-spacing: 0.12em;
        text-align: center;
      ">
        ${name}
      </div>
    `,
    iconSize: [140, 20],
    iconAnchor: [70, 10],
  });
};

// Ocean / Sea Label Icon (Italic Blue-Grey)
const createOceanLabelIcon = (name: string) => {
  return L.divIcon({
    className: 'ocean-map-label',
    html: `
      <div style="
        font-family: 'Instrument Serif', Georgia, serif;
        font-style: italic;
        font-size: 15px;
        color: rgba(147, 197, 253, 0.72);
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95);
        white-space: nowrap;
        pointer-events: none;
        letter-spacing: 0.04em;
        text-align: center;
      ">
        ${name}
      </div>
    `,
    iconSize: [160, 22],
    iconAnchor: [80, 11],
  });
};

// Helper for Reflectivity dBZ Colors
const getDbzColor = (dbz: number): string => {
  if (dbz >= 62) return '#a855f7'; // Hail core / supercell (violet)
  if (dbz >= 55) return '#ef4444'; // Extreme core (crimson red)
  if (dbz >= 48) return '#f97316'; // Severe convection (orange)
  if (dbz >= 40) return '#eab308'; // Heavy rain (yellow)
  if (dbz >= 30) return '#84cc16'; // Moderate rain (lime)
  return '#10b981';                // Light rain (emerald green)
};

// Map Controller for external zoom/center commands
function MapController({
  target,
}: {
  target: { lat: number; lon: number; zoom?: number } | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lon], target.zoom || 7, {
        duration: 1.2,
      });
    }
  }, [target, map]);
  return null;
}

// Map Click Handler for Inspecting Arbitrary Coordinates
function MapClickInspector({
  onMapClick,
}: {
  onMapClick: (lat: number, lon: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// In-map custom control buttons (zoom in, zoom out, reset center, fullscreen)
function MapCustomControls({
  onResetCenter,
}: {
  onResetCenter: () => void;
}) {
  const map = useMap();
  return (
    <div className="absolute bottom-6 right-5 z-[1000] flex flex-col gap-2 pointer-events-auto">
      <button
        onClick={() => map.zoomIn()}
        className="w-9 h-9 rounded-xl bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 text-white hover:text-[#00D5E5] hover:border-[#00D5E5] flex items-center justify-center shadow-2xl transition-all"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-9 h-9 rounded-xl bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 text-white hover:text-[#00D5E5] hover:border-[#00D5E5] flex items-center justify-center shadow-2xl transition-all"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        onClick={onResetCenter}
        className="w-9 h-9 rounded-xl bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 text-[#00D5E5] hover:bg-[#082226] flex items-center justify-center shadow-2xl transition-all"
        title="Reset All India View"
      >
        <Crosshair className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.().catch(() => {});
          } else {
            document.exitFullscreen?.().catch(() => {});
          }
        }}
        className="w-9 h-9 rounded-xl bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 text-white hover:text-[#00D5E5] flex items-center justify-center shadow-2xl transition-all"
        title="Toggle Fullscreen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export const DEFAULT_MAP_LAYERS: LayerVisibility = {
  basemap: 'satellite',
  indiaBorder: true,
  states: true,
  districts: false,
  radarStations: false,
  radarRings: false,
  radarComposite: true,
  satelliteIR: false,
  observedLightning: true,
  stormTracks: true,
  predictedRiskZones: true,
  cities: false,
  satelliteClouds: true,
  cyclones: true,
  windStreamlines: true,
  weatherBadges: true,
  stateLabels: true,
};

// 36 Indian States and UTs centroids for crisp on-map labeling matching the user's reference image
const INDIAN_STATES_LABELS = [
  { name: 'Jammu & Kashmir', lat: 33.77, lon: 75.57 },
  { name: 'Ladakh', lat: 34.15, lon: 77.57 },
  { name: 'Himachal Pradesh', lat: 31.10, lon: 77.17 },
  { name: 'Punjab', lat: 31.14, lon: 75.34 },
  { name: 'Chandigarh', lat: 30.73, lon: 76.77 },
  { name: 'Uttarakhand', lat: 30.06, lon: 79.01 },
  { name: 'Haryana', lat: 29.05, lon: 76.08 },
  { name: 'Delhi', lat: 28.61, lon: 77.20 },
  { name: 'Rajasthan', lat: 26.80, lon: 73.80 },
  { name: 'Uttar Pradesh', lat: 27.10, lon: 80.94 },
  { name: 'Bihar', lat: 25.40, lon: 85.50 },
  { name: 'Madhya Pradesh', lat: 23.25, lon: 77.41 },
  { name: 'Gujarat', lat: 22.40, lon: 71.50 },
  { name: 'Maharashtra', lat: 19.60, lon: 75.80 },
  { name: 'Telangana', lat: 17.87, lon: 79.11 },
  { name: 'Chhattisgarh', lat: 21.27, lon: 81.86 },
  { name: 'Jharkhand', lat: 23.61, lon: 85.27 },
  { name: 'Odisha', lat: 20.60, lon: 84.80 },
  { name: 'Karnataka', lat: 14.80, lon: 75.71 },
  { name: 'Andhra Pradesh', lat: 15.60, lon: 79.74 },
  { name: 'Goa', lat: 15.29, lon: 74.12 },
  { name: 'Kerala', lat: 10.40, lon: 76.40 },
  { name: 'Tamil Nadu', lat: 11.00, lon: 78.65 },
  { name: 'West Bengal', lat: 23.20, lon: 87.85 },
  { name: 'Assam', lat: 26.20, lon: 92.93 },
  { name: 'Meghalaya', lat: 25.46, lon: 91.36 },
  { name: 'Arunachal Pradesh', lat: 28.21, lon: 94.72 },
  { name: 'Nagaland', lat: 26.15, lon: 94.56 },
  { name: 'Manipur', lat: 24.66, lon: 93.90 },
  { name: 'Mizoram', lat: 23.16, lon: 92.93 },
  { name: 'Tripura', lat: 23.84, lon: 91.80 },
  { name: 'Sikkim', lat: 27.53, lon: 88.51 },
];

const NEIGHBOR_COUNTRIES = [
  { name: 'PAKISTAN', lat: 28.5, lon: 68.2 },
  { name: 'CHINA', lat: 31.8, lon: 86.5 },
  { name: 'NEPAL', lat: 28.3, lon: 84.1 },
  { name: 'BANGLADESH', lat: 23.8, lon: 90.2 },
  { name: 'MYANMAR', lat: 21.5, lon: 95.8 },
  { name: 'SRI LANKA', lat: 7.8, lon: 80.7 },
];

const WATER_BODIES = [
  { name: 'Arabian Sea', lat: 17.5, lon: 68.0 },
  { name: 'Bay of Bengal', lat: 16.5, lon: 87.5 },
  { name: 'Indian Ocean', lat: 5.5, lon: 76.5 },
  { name: 'Lakshadweep', lat: 10.5, lon: 72.6 },
  { name: 'Andaman & Nicobar Islands', lat: 11.5, lon: 92.8 },
];

// Dense realistic lightning strikes matching the user reference image
const REALISTIC_LIGHTNING_STRIKES: { id: string; lat: number; lon: number; type: 'CG' | 'IC'; current: number; label: string }[] = [
  // Central India Front (Madhya Pradesh & Maharashtra border arc)
  { id: 'LTG-MP-01', lat: 23.45, lon: 77.30, type: 'CG', current: 58.2, label: 'Bhopal Squall Line' },
  { id: 'LTG-MP-02', lat: 23.55, lon: 77.42, type: 'CG', current: 64.0, label: 'Vidisha Convection' },
  { id: 'LTG-MP-03', lat: 23.38, lon: 77.15, type: 'CG', current: 72.5, label: 'Sehore Core' },
  { id: 'LTG-MP-04', lat: 23.70, lon: 76.85, type: 'CG', current: 48.0, label: 'Shajapur Arc' },
  { id: 'LTG-MP-05', lat: 23.25, lon: 77.60, type: 'IC', current: 24.0, label: 'Raisen Feeder' },
  { id: 'LTG-MP-06', lat: 23.85, lon: 78.60, type: 'CG', current: 55.4, label: 'Sagar Multicell' },
  { id: 'LTG-MP-07', lat: 23.20, lon: 79.95, type: 'CG', current: 68.0, label: 'Jabalpur Core' },
  { id: 'LTG-MP-08', lat: 22.85, lon: 77.80, type: 'CG', current: 46.2, label: 'Hoshangabad Front' },
  { id: 'LTG-MP-09', lat: 21.30, lon: 78.80, type: 'CG', current: 52.0, label: 'Vidarbha Boundary' },
  { id: 'LTG-MP-10', lat: 21.15, lon: 79.10, type: 'IC', current: 19.5, label: 'Nagpur Cluster' },
  { id: 'LTG-MP-11', lat: 21.45, lon: 77.50, type: 'CG', current: 41.0, label: 'Amravati Arc' },
  { id: 'LTG-MP-12', lat: 24.10, lon: 77.80, type: 'IC', current: 22.0, label: 'Guna Inflow' },
  { id: 'LTG-MP-13', lat: 23.10, lon: 78.40, type: 'CG', current: 61.2, label: 'Narsinghpur Core' },
  { id: 'LTG-MP-14', lat: 22.60, lon: 76.20, type: 'CG', current: 45.0, label: 'Indore-Dewas Front' },
  { id: 'LTG-MP-15', lat: 24.50, lon: 76.20, type: 'IC', current: 18.0, label: 'Kota Border Arc' },

  // Tropical Cyclone Dana in Bay of Bengal (Eyewall and spiral rainbands)
  { id: 'LTG-BOB-01', lat: 14.85, lon: 88.55, type: 'CG', current: 84.0, label: 'Cyclone Dana Eyewall' },
  { id: 'LTG-BOB-02', lat: 14.75, lon: 88.45, type: 'CG', current: 78.5, label: 'Cyclone Dana Eyewall' },
  { id: 'LTG-BOB-03', lat: 14.95, lon: 88.65, type: 'CG', current: 92.0, label: 'Eyewall Burst' },
  { id: 'LTG-BOB-04', lat: 14.60, lon: 88.35, type: 'IC', current: 31.0, label: 'Inner Spiral Band' },
  { id: 'LTG-BOB-05', lat: 15.20, lon: 88.10, type: 'CG', current: 62.0, label: 'Northern Feeder Band' },
  { id: 'LTG-BOB-06', lat: 14.30, lon: 88.90, type: 'CG', current: 58.0, label: 'Southern Inflow Band' },
  { id: 'LTG-BOB-07', lat: 15.45, lon: 87.70, type: 'IC', current: 26.5, label: 'Western Spiral Arm' },
  { id: 'LTG-BOB-08', lat: 13.90, lon: 89.20, type: 'CG', current: 67.0, label: 'Outer Convective Band' },

  // Severe Cyclonic Storm Asna in Arabian Sea
  { id: 'LTG-ARB-01', lat: 16.55, lon: 68.25, type: 'CG', current: 70.0, label: 'Cyclone Asna Vortex' },
  { id: 'LTG-ARB-02', lat: 16.40, lon: 68.10, type: 'CG', current: 59.0, label: 'Asna Rainband' },
  { id: 'LTG-ARB-03', lat: 16.85, lon: 68.45, type: 'IC', current: 28.0, label: 'Asna Spiral Arm' },
  { id: 'LTG-ARB-04', lat: 15.95, lon: 68.70, type: 'CG', current: 54.0, label: 'Arabian Sea Convection' },

  // Northeast India (Assam & Meghalaya)
  { id: 'LTG-NE-01', lat: 25.55, lon: 91.85, type: 'CG', current: 76.0, label: 'Meghalaya Orographic Front' },
  { id: 'LTG-NE-02', lat: 25.40, lon: 91.60, type: 'CG', current: 82.0, label: 'Cherrapunji Core' },
  { id: 'LTG-NE-03', lat: 26.15, lon: 91.75, type: 'IC', current: 30.0, label: 'Guwahati Squall' },
  { id: 'LTG-NE-04', lat: 25.80, lon: 92.40, type: 'CG', current: 64.0, label: 'Assam Valley Cell' },

  // South India (Andhra Pradesh & Tamil Nadu)
  { id: 'LTG-SI-01', lat: 13.40, lon: 80.10, type: 'CG', current: 48.0, label: 'Pulicat Lake Cell' },
  { id: 'LTG-SI-02', lat: 12.80, lon: 79.80, type: 'IC', current: 22.0, label: 'Kanchipuram Band' },
  { id: 'LTG-SI-03', lat: 16.20, lon: 80.40, type: 'CG', current: 52.0, label: 'Guntur Cluster' },
];

// Continuous Radar Reflectivity Squall Line Arcs (Coordinates as [lat, lon])
const MP_SQUALL_OUTER_GREEN: [number, number][] = [
  [25.8, 75.2], [25.4, 76.2], [24.8, 77.0], [23.9, 77.8], [23.3, 78.5], [22.8, 79.5], [22.0, 80.2],
  [21.2, 79.8], [20.8, 78.8], [21.5, 78.0], [22.4, 77.2], [23.2, 76.5], [24.2, 75.8], [25.2, 74.8]
];

const MP_SQUALL_MID_YELLOW: [number, number][] = [
  [25.5, 75.5], [25.1, 76.4], [24.5, 77.2], [23.8, 77.9], [23.2, 78.7], [22.6, 79.6],
  [21.8, 79.5], [21.2, 78.6], [21.8, 77.8], [22.7, 77.0], [23.5, 76.4], [24.5, 75.6]
];

const MP_SQUALL_SEVERE_ORANGE: [number, number][] = [
  [25.2, 75.8], [24.8, 76.6], [24.2, 77.4], [23.6, 78.1], [23.1, 78.9],
  [22.4, 79.2], [21.8, 78.4], [22.5, 77.5], [23.3, 76.8], [24.2, 76.2]
];

const MP_SQUALL_CORE_RED: [number, number][] = [
  [24.9, 76.0], [24.5, 76.8], [23.9, 77.6], [23.4, 78.2], [22.9, 78.7],
  [22.4, 78.5], [22.8, 77.7], [23.5, 77.2], [24.1, 76.5]
];

// Northeast Assam/Meghalaya Convective System
const ASSAM_STORM_GREEN: [number, number][] = [
  [26.6, 91.0], [26.8, 92.5], [26.4, 93.8], [25.2, 93.5], [24.8, 92.0], [25.2, 90.5]
];
const ASSAM_STORM_YELLOW: [number, number][] = [
  [26.4, 91.3], [26.6, 92.4], [26.2, 93.4], [25.4, 93.1], [25.1, 92.0], [25.4, 91.0]
];
const ASSAM_STORM_RED: [number, number][] = [
  [26.2, 91.6], [26.3, 92.5], [25.9, 93.0], [25.5, 92.4], [25.3, 91.5]
];

// Arabian Sea Cyclonic Radar Rainbands
const ARB_STORM_GREEN: [number, number][] = [
  [17.8, 66.8], [18.2, 68.5], [17.5, 69.8], [15.8, 69.6], [15.0, 68.2], [16.2, 66.5]
];
const ARB_STORM_YELLOW: [number, number][] = [
  [17.4, 67.2], [17.8, 68.4], [17.1, 69.3], [16.1, 69.1], [15.5, 68.1], [16.5, 67.0]
];
const ARB_STORM_RED: [number, number][] = [
  [17.0, 67.6], [17.3, 68.4], [16.7, 68.9], [16.1, 68.3], [16.4, 67.5]
];

// Animated Wind Streamlines paths
const WIND_STREAMLINES: [number, number][][] = [
  // Spiral inflow into Cyclone Dana (Bay of Bengal)
  [[12.5, 84.5], [13.2, 86.0], [14.0, 87.5], [14.8, 88.5]],
  [[17.5, 91.5], [16.5, 90.0], [15.5, 89.0], [14.8, 88.5]],
  [[16.8, 85.5], [16.0, 86.8], [15.2, 87.8], [14.8, 88.5]],
  [[12.8, 91.0], [13.8, 90.2], [14.4, 89.2], [14.8, 88.5]],

  // Spiral inflow into Cyclone Asna (Arabian Sea)
  [[14.0, 65.0], [15.0, 66.5], [16.0, 67.5], [16.5, 68.2]],
  [[19.0, 70.5], [18.0, 69.5], [17.2, 68.8], [16.5, 68.2]],
  [[15.0, 71.0], [15.8, 69.8], [16.2, 69.0], [16.5, 68.2]],

  // South-westerly monsoon winds blowing into Central India
  [[13.0, 73.0], [15.5, 74.5], [18.5, 76.0], [21.5, 77.5]],
  [[15.0, 72.5], [17.8, 74.8], [20.5, 76.5], [23.0, 77.5]],
  [[21.0, 76.0], [22.5, 77.0], [23.5, 78.0], [25.0, 80.0]],
];

export interface InteractiveAtmosphericMapProps {
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
  layers?: LayerVisibility;
  radarFrame?: RadarCompositeFrame | null;
  radarStations?: RadarStation[];
  observedStrikes?: ObservedStrike[];
  activeStorms?: TrackedStorm[];
  riskZones?: RiskZone[];
  indiaBoundaryGeoJson?: any;
  indiaStatesGeoJson?: any;
  indiaDistrictsGeoJson?: any;
  onSelectItem?: (item: InspectorItem) => void;
  flyToTarget?: { lat: number; lon: number; zoom?: number } | null;
  className?: string;

  // Backwards compatibility
  storms?: any[];
  lightningStrikes?: any[];
  radarPoints?: any[];
  thunderstormProb?: number;
}

export const InteractiveAtmosphericMap: React.FC<InteractiveAtmosphericMapProps> = ({
  centerLat = 22.5937,
  centerLon = 78.9629,
  zoom = 5,
  layers,
  radarFrame,
  radarStations = [],
  observedStrikes = [],
  activeStorms = [],
  riskZones = [],
  indiaBoundaryGeoJson,
  indiaStatesGeoJson,
  indiaDistrictsGeoJson,
  onSelectItem = () => {},
  flyToTarget = null,
  className = 'h-full w-full',
  storms,
  lightningStrikes,
  radarPoints,
  thunderstormProb,
}) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState<'BENCHMARK' | 'REALTIME'>('BENCHMARK');
  const [lightningDimState, setLightningDimState] = useState<'DIM' | 'OFF'>('DIM');
  const [nowTimeStr, setNowTimeStr] = useState<string>('13:20 IST');

  // Self-hydration for boundaries and stations
  const [geoBoundary, setGeoBoundary] = useState<any>(indiaBoundaryGeoJson || null);
  const [geoStates, setGeoStates] = useState<any>(indiaStatesGeoJson || null);
  const [geoDistricts, setGeoDistricts] = useState<any>(indiaDistrictsGeoJson || null);

  useEffect(() => {
    if (indiaBoundaryGeoJson) {
      setGeoBoundary(indiaBoundaryGeoJson);
    } else if (!geoBoundary) {
      fetch('/geo/india_boundary.geojson')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setGeoBoundary(data))
        .catch(() => {});
    }
  }, [indiaBoundaryGeoJson]);

  useEffect(() => {
    if (indiaStatesGeoJson) {
      setGeoStates(indiaStatesGeoJson);
    } else if (!geoStates) {
      fetch('/geo/india_states.geojson')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setGeoStates(data))
        .catch(() => {});
    }
  }, [indiaStatesGeoJson]);

  useEffect(() => {
    if (indiaDistrictsGeoJson) {
      setGeoDistricts(indiaDistrictsGeoJson);
    }
  }, [indiaDistrictsGeoJson]);

  // Compute effective active layers with safe defaults matching reference image
  const effectiveLayers: LayerVisibility = React.useMemo(() => {
    return {
      ...DEFAULT_MAP_LAYERS,
      ...(layers || {}),
    };
  }, [layers]);

  // Style for India Country Boundary (Luminous Neon Electric Cyan Glow)
  const countryBoundaryStyle = {
    color: '#00f5ff',
    weight: 2.8,
    opacity: 0.95,
    fillColor: '#00e5ff',
    fillOpacity: 0.02,
    className: 'neon-boundary-glow',
  };

  // Style for States
  const stateStyle = (feature: any) => {
    const isHovered = hoveredFeature === feature?.properties?.name;
    return {
      color: isHovered ? '#00f5ff' : '#00e5ff',
      weight: isHovered ? 2.0 : 1.2,
      opacity: isHovered ? 1.0 : 0.85,
      fillColor: isHovered ? '#00d5e5' : 'transparent',
      fillOpacity: isHovered ? 0.15 : 0.0,
      className: 'neon-state-glow',
    };
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-[#030a0d] shadow-2xl ${className}`}>
      {/* 1. Compass / Coordinate Overlay */}
      <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 rounded-xl bg-[#061418]/85 backdrop-blur-md border border-[#087F80]/40 text-xs font-mono text-[#9BAEB1] flex items-center gap-2 shadow-xl pointer-events-none">
        <Navigation className="w-3.5 h-3.5 text-[#00D5E5] rotate-45" />
        <span className="text-white font-bold">INDIA SECTOR</span>
        <span className="hidden md:inline opacity-70">| 8.4°N - 37.6°N, 68.7°E - 97.2°E</span>
      </div>

      {/* 2. Top-Right Controls: Yellow Sparks Dim/Off Switch + Convective Risk */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
        <button
          onClick={() => setLightningDimState((prev) => (prev === 'DIM' ? 'OFF' : 'DIM'))}
          className={`px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-mono flex items-center gap-1.5 shadow-xl transition-all cursor-pointer ${
            lightningDimState === 'DIM'
              ? 'bg-[#061418]/90 border-amber-400/40 text-amber-200/90 hover:border-amber-300'
              : 'bg-[#061418]/90 border-slate-700/60 text-slate-400 hover:text-slate-200'
          }`}
          title="Click to toggle yellow lightning sparks: Dim or Off"
        >
          <span className="text-xs">⚡</span>
          <span className="hidden sm:inline">Yellow Dots:</span>
          <span className={lightningDimState === 'DIM' ? 'text-amber-300 font-bold' : 'text-slate-400 font-bold'}>
            {lightningDimState === 'DIM' ? 'Dim (Soft)' : 'Off (Hidden)'}
          </span>
        </button>

        {thunderstormProb !== undefined && (
          <div className="px-3.5 py-1.5 rounded-xl bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 text-xs font-mono flex items-center gap-2 shadow-xl pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-bold">CONVECTIVE RISK:</span>
            <span className={thunderstormProb >= 70 ? 'text-[#FF4D4D] font-black' : 'text-amber-400 font-bold'}>
              {thunderstormProb}%
            </span>
          </div>
        )}
      </div>

      {/* 3. EXACT LIVE STATUS PILL (Matching user reference image bottom-left) */}
      <div
        onClick={() => setLiveMode(liveMode === 'BENCHMARK' ? 'REALTIME' : 'BENCHMARK')}
        className="absolute bottom-5 left-5 z-[1000] px-4 py-2 rounded-2xl live-telemetry-pill flex items-center gap-3 text-xs font-mono text-white select-none cursor-pointer transition-all hover:border-[#00D5E5]"
        title="Click to toggle between Benchmark Snapshot and Realtime Clock"
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]"></div>
          <span className="text-[#22c55e] font-extrabold tracking-wider text-[11px]">LIVE</span>
        </div>
        <div className="h-3 w-[1px] bg-[#087F80]/60"></div>
        <span className="font-semibold text-slate-200">
          {liveMode === 'BENCHMARK' ? '13 Oct 2024' : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <div className="h-3 w-[1px] bg-[#087F80]/60"></div>
        <span className="text-[#00D5E5] font-bold">
          {liveMode === 'BENCHMARK' ? '13:20 IST' : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'}
        </span>
        <div className="h-3 w-[1px] bg-[#087F80]/60"></div>
        <span className="text-[#9BAEB1] text-[11px]">Data age: 8 minutes</span>
      </div>

      {/* 4. Metric Scale Bar (Matching user reference image bottom-right) */}
      <div className="absolute bottom-5 right-20 z-[1000] px-3 py-1 rounded-lg bg-[#061418]/80 backdrop-blur-sm border border-[#087F80]/30 font-mono text-[10px] text-slate-300 pointer-events-none hidden sm:flex items-center gap-2">
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-28 text-[9px] text-slate-400">
            <span>0</span>
            <span>250</span>
            <span>500</span>
            <span>1,000 km</span>
          </div>
          <div className="h-1 w-28 border-x border-b border-[#00d5e5] bg-gradient-to-r from-transparent via-[#00d5e5]/40 to-transparent"></div>
        </div>
      </div>

      <MapContainer
        center={[centerLat, centerLon]}
        zoom={zoom}
        minZoom={4}
        maxZoom={14}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', backgroundColor: '#030a0d' }}
      >
        <MapController target={flyToTarget} />
        <MapCustomControls
          onResetCenter={() => {
            onSelectItem({
              type: 'COORDINATE',
              data: { lat: 22.5937, lon: 78.9629 },
            });
          }}
        />
        <MapClickInspector
          onMapClick={(lat, lon) => {
            onSelectItem({
              type: 'COORDINATE',
              data: { lat, lon },
            });
          }}
        />

        {/* 1. ESRI High-Resolution Basemaps (Keyless & Watermark-Free) */}
        {effectiveLayers.basemap === 'dark_canvas' ? (
          <>
            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              className="dark-canvas-tile"
              maxZoom={16}
            />
            <TileLayer
              attribution=""
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
              opacity={0.7}
            />
          </>
        ) : (
          <TileLayer
            attribution='&copy; Esri, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            className="satellite-earth-tile"
            maxZoom={16}
          />
        )}

        {/* 2. India National Boundary Layer (Neon Electric Cyan Glow) */}
        {effectiveLayers.indiaBorder && geoBoundary && (
          <GeoJSON
            key="india-boundary"
            data={geoBoundary}
            style={countryBoundaryStyle}
          />
        )}

        {/* 3. India States Layer (Glowing Neon Boundaries) */}
        {effectiveLayers.states && geoStates && (
          <GeoJSON
            key="india-states"
            data={geoStates}
            style={stateStyle}
            onEachFeature={(feature, layer) => {
              const name = feature.properties?.name;
              layer.on({
                mouseover: () => setHoveredFeature(name),
                mouseout: () => setHoveredFeature(null),
                click: () => onSelectItem({ type: 'STATE', data: feature.properties }),
              });
              layer.bindTooltip(
                `<div class="font-mono text-xs"><b>${name}</b><br/><span style="color:#00D5E5">Threat: ${feature.properties?.thunderstorm_risk || 'MODERATE'}</span></div>`,
                { sticky: true, opacity: 0.95 }
              );
            }}
          />
        )}

        {/* 4. India Districts Layer */}
        {effectiveLayers.districts && geoDistricts && (
          <GeoJSON
            key="india-districts"
            data={geoDistricts}
            style={{
              color: '#087F80',
              weight: 0.8,
              opacity: 0.45,
              fillColor: '#082226',
              fillOpacity: 0.05,
            }}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => onSelectItem({ type: 'DISTRICT', data: feature.properties }),
              });
            }}
          />
        )}

        {/* 5. Photorealistic Satellite Cloud Formations & Tropical Cyclones */}
        {effectiveLayers.satelliteClouds !== false && (
          <>
            {/* Bay of Bengal Tropical Cyclone Dana (Real Satellite Imagery from User Reference Image) */}
            <Marker
              position={[14.8, 88.5]}
              interactive={false}
              icon={L.divIcon({
                className: 'custom-cyclone-cloud-dana',
                html: `
                  <div class="cyclone-vortex-animated" style="
                    width: 380px;
                    height: 380px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                  ">
                    <img
                      src="/images/realistic_cyclone_clean.png"
                      alt="Tropical Cyclone Dana Satellite"
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        filter: contrast(1.18) brightness(1.05) drop-shadow(0 0 25px rgba(0, 229, 255, 0.25));
                        border-radius: 50%;
                        pointer-events: none;
                      "
                    />
                  </div>
                `,
                iconSize: [380, 380],
                iconAnchor: [190, 190],
              })}
            />

            {/* Arabian Sea Severe Cyclonic Storm Asna (Real Satellite Imagery from User Reference Image) */}
            <Marker
              position={[16.5, 68.2]}
              interactive={false}
              icon={L.divIcon({
                className: 'custom-cyclone-cloud-asna',
                html: `
                  <div class="cyclone-vortex-animated" style="
                    width: 290px;
                    height: 290px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                  ">
                    <img
                      src="/images/realistic_cyclone_clean.png"
                      alt="Severe Cyclonic Storm Asna Satellite"
                      style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        filter: contrast(1.12) brightness(0.98) drop-shadow(0 0 20px rgba(0, 229, 255, 0.2));
                        border-radius: 50%;
                        pointer-events: none;
                      "
                    />
                  </div>
                `,
                iconSize: [290, 290],
                iconAnchor: [145, 145],
              })}
            />

            {/* Convective Cloud Sheet over Central India */}
            <Marker
              position={[23.5, 77.8]}
              icon={L.divIcon({
                className: 'custom-central-clouds',
                html: `
                  <div style="width: 360px; height: 180px; opacity: 0.7; filter: blur(4px); pointer-events: none;">
                    <svg viewBox="0 0 360 180" width="360" height="180">
                      <ellipse cx="180" cy="90" rx="160" ry="70" fill="#ffffff" opacity="0.45" />
                      <ellipse cx="150" cy="85" rx="110" ry="45" fill="#ffffff" opacity="0.65" />
                      <ellipse cx="210" cy="95" rx="90" ry="40" fill="#f8fafc" opacity="0.6" />
                    </svg>
                  </div>
                `,
                iconSize: [360, 180],
                iconAnchor: [180, 90],
              })}
            />

            {/* Convective Anvil Cloud over Northeast India */}
            <Marker
              position={[25.8, 92.2]}
              icon={L.divIcon({
                className: 'custom-northeast-clouds',
                html: `
                  <div style="width: 220px; height: 150px; opacity: 0.75; filter: blur(3px); pointer-events: none;">
                    <svg viewBox="0 0 220 150" width="220" height="150">
                      <ellipse cx="110" cy="75" rx="95" ry="55" fill="#ffffff" opacity="0.55" />
                      <ellipse cx="100" cy="70" rx="70" ry="38" fill="#ffffff" opacity="0.75" />
                    </svg>
                  </div>
                `,
                iconSize: [220, 150],
                iconAnchor: [110, 75],
              })}
            />
          </>
        )}

        {/* 6. Continuous Radar Reflectivity Convective Squall Lines (Multi-Stop Gradient Bands) */}
        {effectiveLayers.radarComposite && (
          <>
            {/* Central India Squall Line - Outer Green Band */}
            <Polygon
              positions={MP_SQUALL_OUTER_GREEN}
              pathOptions={{
                color: '#22c55e',
                fillColor: '#22c55e',
                fillOpacity: 0.55,
                weight: 0,
              }}
            />
            {/* Central India Squall Line - Mid Yellow Band (Soft & Eye Friendly) */}
            <Polygon
              positions={MP_SQUALL_MID_YELLOW}
              pathOptions={{
                color: '#eab308',
                fillColor: '#eab308',
                fillOpacity: 0.48,
                weight: 0,
              }}
            />
            {/* Central India Squall Line - Severe Orange Band */}
            <Polygon
              positions={MP_SQUALL_SEVERE_ORANGE}
              pathOptions={{
                color: '#f97316',
                fillColor: '#f97316',
                fillOpacity: 0.85,
                weight: 0,
              }}
            />
            {/* Central India Squall Line - Extreme Red Core */}
            <Polygon
              positions={MP_SQUALL_CORE_RED}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.95,
                weight: 0,
                className: 'squall-core-glow',
              }}
            >
              <Tooltip sticky>
                <div className="font-mono text-xs">
                  <b style={{ color: '#ef4444' }}>CENTRAL INDIA SQUALL LINE</b>
                  <br />
                  <span>Max Reflectivity: 65.5 dBZ | Hail Probability: 85%</span>
                  <br />
                  <span>Downburst Winds: 92 km/h</span>
                </div>
              </Tooltip>
            </Polygon>

            {/* Northeast Assam/Meghalaya Storm System */}
            <Polygon
              positions={ASSAM_STORM_GREEN}
              pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.55, weight: 0 }}
            />
            <Polygon
              positions={ASSAM_STORM_YELLOW}
              pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.75, weight: 0 }}
            />
            <Polygon
              positions={ASSAM_STORM_RED}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.92, weight: 0 }}
            >
              <Tooltip sticky>
                <div className="font-mono text-xs">
                  <b style={{ color: '#ef4444' }}>MEGHALAYA OROGRAPHIC SUPERCELL</b>
                  <br />
                  <span>Max Reflectivity: 63.0 dBZ | Flash Flood Alert</span>
                </div>
              </Tooltip>
            </Polygon>

            {/* Arabian Sea Storm System */}
            <Polygon
              positions={ARB_STORM_GREEN}
              pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.55, weight: 0 }}
            />
            <Polygon
              positions={ARB_STORM_YELLOW}
              pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.72, weight: 0 }}
            />
            <Polygon
              positions={ARB_STORM_RED}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.92, weight: 0 }}
            />

            {/* Dynamic Radar Points from Backend */}
            {radarFrame &&
              (radarFrame.points || []).map((pt, idx) => {
                const color = getDbzColor(pt.reflectivity_dbz);
                return (
                  <Circle
                    key={`dbz-${idx}`}
                    center={[pt.lat, pt.lon]}
                    radius={pt.reflectivity_dbz >= 55 ? 5800 : 4200}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: pt.reflectivity_dbz >= 50 ? 0.7 : 0.45,
                      weight: 0,
                    }}
                  >
                    <Tooltip opacity={0.9}>
                      <div className="font-mono text-xs">
                        <b>{pt.reflectivity_dbz} dBZ</b> ({pt.cluster_name || 'Convective Core'})<br />
                        <span>Echo Top: {pt.echo_top_km} km</span>
                      </div>
                    </Tooltip>
                  </Circle>
                );
              })}
          </>
        )}

        {/* 7. Dim / Eye-Comfortable Lightning Pinpricks (Toggleable: Dim or Off) */}
        {effectiveLayers.observedLightning && lightningDimState !== 'OFF' && (
          <>
            {/* Primary Subtle Pinprick Strikes Matching Reference Image */}
            {REALISTIC_LIGHTNING_STRIKES.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lon]}
                icon={createLightningSparkIcon(s.type, s.current)}
                eventHandlers={{
                  click: () =>
                    onSelectItem({
                      type: 'LIGHTNING',
                      data: {
                        id: s.id,
                        lat: s.lat,
                        lon: s.lon,
                        strike_type: s.type,
                        peak_current_ka: s.current,
                        district: s.label,
                      },
                    }),
                }}
              >
                <Tooltip direction="top" offset={[0, -4]} opacity={0.92}>
                  <div className="font-mono text-xs">
                    <b style={{ color: '#fef08a' }}>⚡ {s.type === 'CG' ? 'CLOUD-TO-GROUND' : 'INTRA-CLOUD'} LIGHTNING</b>
                    <br />
                    <span>Peak Current: {s.current} kA</span>
                    <br />
                    <span>Location: {s.label}</span>
                  </div>
                </Tooltip>
              </Marker>
            ))}

            {/* Dynamic strikes from backend */}
            {(observedStrikes || []).map((strike) => (
              <Marker
                key={strike.id}
                position={[strike.lat, strike.lon]}
                icon={createLightningSparkIcon(strike.strike_type, strike.peak_current_ka)}
              />
            ))}
          </>
        )}

        {/* 8. Animated Wind Streamlines */}
        {effectiveLayers.windStreamlines !== false &&
          WIND_STREAMLINES.map((path, idx) => (
            <Polyline
              key={`wind-${idx}`}
              positions={path}
              pathOptions={{
                color: '#38bdf8',
                weight: 1.8,
                opacity: 0.65,
                className: 'wind-streamline-path',
              }}
            />
          ))}

        {/* 9. Interactive Weather Condition Badges ("barish wala logo, thunder ho toh thunder ke logos") */}
        {effectiveLayers.weatherBadges !== false && (
          <>
            {/* Tropical Cyclone Dana Badge in Bay of Bengal (Cleanly positioned below storm eye) */}
            <Marker
              position={[13.3, 88.5]}
              icon={createWeatherBadgeIcon('CYCLONE', 'Cyclone Dana (Cat 2)', '135 km/h • 976 hPa')}
              eventHandlers={{
                click: () =>
                  onSelectItem({
                    type: 'STORM',
                    data: {
                      id: 'CYCLONE-BOB-01',
                      name: 'Tropical Cyclone Dana (Cat 2)',
                      state: 'Bay of Bengal',
                      max_reflectivity_dbz: 64.5,
                      speed_kmh: 18,
                      heading_deg: 330,
                    },
                  }),
              }}
            />

            {/* Severe Cyclonic Storm Asna Badge in Arabian Sea (Cleanly positioned below storm eye) */}
            <Marker
              position={[15.0, 68.2]}
              icon={createWeatherBadgeIcon('CYCLONE', 'Cyclone Asna', '105 km/h • 988 hPa')}
              eventHandlers={{
                click: () =>
                  onSelectItem({
                    type: 'STORM',
                    data: {
                      id: 'CYCLONE-ARB-01',
                      name: 'Severe Cyclonic Storm Asna',
                      state: 'Arabian Sea',
                      max_reflectivity_dbz: 58.5,
                      speed_kmh: 16,
                      heading_deg: 315,
                    },
                  }),
              }}
            />

            {/* Central MP Squall Line Thunderstorm Badge */}
            <Marker
              position={[23.4, 77.4]}
              icon={createWeatherBadgeIcon('THUNDER', 'Severe Thunderstorm', '65 dBZ • Heavy Lightning')}
            />

            {/* Tornado Vortex Badge along MP Squall Line */}
            <Marker
              position={[23.7, 76.8]}
              icon={createWeatherBadgeIcon('TORNADO', 'Mesocyclone Vortex', 'Shear 48 m/s • Hail Alert')}
            />

            {/* Heavy Rain Badge over Vidarbha Corridor */}
            <Marker
              position={[21.4, 78.5]}
              icon={createWeatherBadgeIcon('RAIN', 'Heavy Downpour', '52 mm/h • Squall Front')}
            />

            {/* Heavy Rain & Thunder Badge over Meghalaya/Assam */}
            <Marker
              position={[25.8, 92.0]}
              icon={createWeatherBadgeIcon('RAIN', 'Flash Flood Warning', '68 mm/h • Orographic')}
            />

            <Marker
              position={[25.3, 91.5]}
              icon={createWeatherBadgeIcon('THUNDER', 'Severe Convection', '63 dBZ • CG Lightning')}
            />

            {/* Coastal Rain Badge over Konkan / Goa */}
            <Marker
              position={[15.6, 73.6]}
              icon={createWeatherBadgeIcon('RAIN', 'Coastal Inflow Rain', '40 mm/h')}
            />
          </>
        )}

        {/* 10. Tracked Storm Paths & Trajectories */}
        {effectiveLayers.stormTracks &&
          (activeStorms || []).map((storm) => {
            const pastCoords = (storm.past_track || []).map((p) => [p.lat, p.lon] as [number, number]);
            const futureCoords = [
              [storm.center_lat, storm.center_lon] as [number, number],
              ...(storm.future_track || []).map((p) => [p.lat, p.lon] as [number, number]),
            ];

            return (
              <React.Fragment key={storm.id}>
                {pastCoords.length > 1 && (
                  <Polyline
                    positions={pastCoords}
                    pathOptions={{ color: '#ff4d4d', weight: 2.2, opacity: 0.85 }}
                  />
                )}
                {futureCoords.length > 1 && (
                  <Polyline
                    positions={futureCoords}
                    pathOptions={{ color: '#ff4d4d', weight: 2.2, dashArray: '5, 5', opacity: 0.85 }}
                  />
                )}
                {/* Render circular storm marker ONLY for non-cyclone cells to prevent overlap with the cyclone badge */}
                {(storm as any).storm_type !== 'CYCLONE' && (
                  <Marker
                    position={[storm.center_lat, storm.center_lon]}
                    icon={createStormIcon(storm.severity, (storm as any).storm_type)}
                    eventHandlers={{
                      click: () => onSelectItem({ type: 'STORM', data: storm }),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
                      <div className="font-mono text-xs">
                        <b style={{ color: '#FF4D4D' }}>{storm.name}</b>
                        <br />
                        <span>{storm.max_reflectivity_dbz} dBZ | {storm.speed_kmh} km/h heading {storm.heading_deg}°</span>
                      </div>
                    </Tooltip>
                  </Marker>
                )}
              </React.Fragment>
            );
          })}

        {/* 11. State & Geographic Typography Labels (Exact match to reference image) */}
        {effectiveLayers.stateLabels !== false && (
          <>
            {/* 36 Indian States & UTs */}
            {INDIAN_STATES_LABELS.map((st) => (
              <Marker
                key={`st-lbl-${st.name}`}
                position={[st.lat, st.lon]}
                icon={createStateLabelIcon(st.name)}
                interactive={false}
              />
            ))}

            {/* Neighboring Countries */}
            {NEIGHBOR_COUNTRIES.map((ct) => (
              <Marker
                key={`ct-lbl-${ct.name}`}
                position={[ct.lat, ct.lon]}
                icon={createCountryLabelIcon(ct.name)}
                interactive={false}
              />
            ))}

            {/* Water Bodies */}
            {WATER_BODIES.map((wb) => (
              <Marker
                key={`wb-lbl-${wb.name}`}
                position={[wb.lat, wb.lon]}
                icon={createOceanLabelIcon(wb.name)}
                interactive={false}
              />
            ))}
          </>
        )}

        {/* 12. Optional Doppler Radar Stations */}
        {effectiveLayers.radarStations &&
          (radarStations || []).map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lon]}
              icon={createRadarIcon(station.status)}
              eventHandlers={{
                click: () => onSelectItem({ type: 'RADAR', data: station }),
              }}
            >
              <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
                <div className="font-mono text-xs">
                  <b>{station.name}</b> ({station.station_code})<br />
                  <span style={{ color: '#00D5E5' }}>{station.band}-Band Doppler Radar</span>
                </div>
              </Tooltip>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
