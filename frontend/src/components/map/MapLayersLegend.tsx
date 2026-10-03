import React, { useState } from 'react';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Radio,
  Satellite,
  CloudLightning,
  AlertTriangle,
  MapPin,
  Building2,
  Navigation,
  Globe,
  Sliders,
} from 'lucide-react';
import type { LayerVisibility } from '../../types/indiaMap';

interface MapLayersLegendProps {
  layers: LayerVisibility;
  onToggleLayer: (layerKey: keyof LayerVisibility, value?: any) => void;
}

export const MapLayersLegend: React.FC<MapLayersLegendProps> = ({
  layers,
  onToggleLayer,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#061418]/95 backdrop-blur-md border border-[#087F80]/50 rounded-xl shadow-2xl font-mono text-xs overflow-hidden transition-all duration-200">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-3.5 py-2 flex items-center justify-between cursor-pointer hover:bg-[#082226] select-none"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#00D5E5]" />
          <span className="text-white font-bold text-[11px] uppercase tracking-wider">
            Layer Controls & Meteorological Legend
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick mini dBZ preview */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
            <span className="text-[#9BAEB1]">dBZ:</span>
            <div className="flex h-2 w-28 rounded-full overflow-hidden border border-[#087F80]/40">
              <span className="flex-1 bg-[#10b981]" title="20-30 dBZ" />
              <span className="flex-1 bg-[#84cc16]" title="30-40 dBZ" />
              <span className="flex-1 bg-[#eab308]" title="40-50 dBZ" />
              <span className="flex-1 bg-[#f97316]" title="50-58 dBZ" />
              <span className="flex-1 bg-[#ef4444]" title="58-65 dBZ" />
              <span className="flex-1 bg-[#a855f7]" title="65+ dBZ" />
            </div>
          </div>

          <button className="text-[#9BAEB1] hover:text-white p-0.5">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3.5 border-t border-[#073B3C] space-y-4">
          {/* 1. Basemap Switcher */}
          <div>
            <div className="text-[10px] text-[#9BAEB1] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#00D5E5]" />
              Basemap Source (ESRI High-Resolution)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onToggleLayer('basemap', 'dark_canvas')}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold border transition-all ${
                  layers.basemap === 'dark_canvas'
                    ? 'bg-[#00D5E5]/20 text-[#00D5E5] border-[#00D5E5]'
                    : 'bg-[#082226] text-[#9BAEB1] border-[#087F80]/40 hover:text-white'
                }`}
              >
                World Dark Gray Canvas
              </button>
              <button
                onClick={() => onToggleLayer('basemap', 'satellite')}
                className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold border transition-all ${
                  layers.basemap === 'satellite'
                    ? 'bg-[#00D5E5]/20 text-[#00D5E5] border-[#00D5E5]'
                    : 'bg-[#082226] text-[#9BAEB1] border-[#087F80]/40 hover:text-white'
                }`}
              >
                ESRI Satellite Imagery
              </button>
            </div>
          </div>

          {/* 2. Atmospheric & Sensor Layers */}
          <div>
            <div className="text-[10px] text-[#9BAEB1] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#00D5E5]" />
              Atmospheric & Observational Overlays
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* Radar Composite */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.radarComposite}
                  onChange={(e) => onToggleLayer('radarComposite', e.target.checked)}
                  className="rounded accent-[#00D5E5]"
                />
                <Radio className="w-3.5 h-3.5 text-[#00D5E5]" />
                <span className="text-white text-[11px]">DWR Composite</span>
              </label>

              {/* Observed Lightning */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.observedLightning}
                  onChange={(e) => onToggleLayer('observedLightning', e.target.checked)}
                  className="rounded accent-[#FFD166]"
                />
                <CloudLightning className="w-3.5 h-3.5 text-[#FFD166]" />
                <span className="text-white text-[11px]">Observed Lightning</span>
              </label>

              {/* Storm Tracks */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.stormTracks}
                  onChange={(e) => onToggleLayer('stormTracks', e.target.checked)}
                  className="rounded accent-[#FF4D4D]"
                />
                <Navigation className="w-3.5 h-3.5 text-[#FF4D4D]" />
                <span className="text-white text-[11px]">Storm Vectors</span>
              </label>

              {/* AI Risk Zones */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.predictedRiskZones}
                  onChange={(e) => onToggleLayer('predictedRiskZones', e.target.checked)}
                  className="rounded accent-purple-500"
                />
                <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-white text-[11px]">AI Risk Zones</span>
              </label>

              {/* Satellite Clouds */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.satelliteClouds !== false}
                  onChange={(e) => onToggleLayer('satelliteClouds', e.target.checked)}
                  className="rounded accent-[#00D5E5]"
                />
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-white text-[11px]">Satellite Clouds</span>
              </label>

              {/* Cyclones & Tornadoes */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.cyclones !== false}
                  onChange={(e) => onToggleLayer('cyclones', e.target.checked)}
                  className="rounded accent-cyan-400"
                />
                <span className="text-sm">🌀</span>
                <span className="text-white text-[11px]">Cyclones & Tornadoes</span>
              </label>

              {/* Wind Streamlines */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.windStreamlines !== false}
                  onChange={(e) => onToggleLayer('windStreamlines', e.target.checked)}
                  className="rounded accent-sky-400"
                />
                <Wind className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-white text-[11px]">Wind Flow</span>
              </label>

              {/* Weather Badges (Rain & Thunder Logos) */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.weatherBadges !== false}
                  onChange={(e) => onToggleLayer('weatherBadges', e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <span className="text-sm">⛈️</span>
                <span className="text-white text-[11px]">Rain & Thunder Logos</span>
              </label>

              {/* State Labels Typography */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.stateLabels !== false}
                  onChange={(e) => onToggleLayer('stateLabels', e.target.checked)}
                  className="rounded accent-[#00D5E5]"
                />
                <span className="text-xs font-bold text-slate-300">Aa</span>
                <span className="text-white text-[11px]">State Labels</span>
              </label>

              {/* States Layer */}
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#082226] border border-[#087F80]/40 cursor-pointer hover:border-[#00D5E5] transition-colors">
                <input
                  type="checkbox"
                  checked={layers.states}
                  onChange={(e) => onToggleLayer('states', e.target.checked)}
                  className="rounded accent-[#00D5E5]"
                />
                <MapPin className="w-3.5 h-3.5 text-[#00D5E5]" />
                <span className="text-white text-[11px]">State Borders</span>
              </label>
            </div>
          </div>

          {/* 3. Symbology & Reflectivity Scale */}
          <div className="pt-2 border-t border-[#073B3C] space-y-2">
            <div className="text-[10px] text-[#9BAEB1] uppercase tracking-wider">
              Meteorological Reflectivity Scale (dBZ)
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex h-3 w-full rounded-md overflow-hidden border border-[#087F80]/50 shadow-inner">
                <div className="flex-1 bg-[#10b981]" />
                <div className="flex-1 bg-[#84cc16]" />
                <div className="flex-1 bg-[#eab308]" />
                <div className="flex-1 bg-[#f97316]" />
                <div className="flex-1 bg-[#ef4444]" />
                <div className="flex-1 bg-[#a855f7]" />
              </div>
              <div className="flex justify-between text-[9px] text-[#9BAEB1]">
                <span>20 dBZ (Light)</span>
                <span>35 dBZ (Moderate)</span>
                <span>45 dBZ (Heavy)</span>
                <span>55 dBZ (Severe)</span>
                <span>65+ dBZ (Hail Core)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1.5 text-[10px] text-[#9BAEB1]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFD166] shadow-[0_0_6px_#FFD166]" />
                <span className="text-white">Cloud-to-Ground (CG) Lightning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00D5E5] shadow-[0_0_6px_#00D5E5]" />
                <span className="text-white">Intra-Cloud (IC) Lightning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#FF4D4D]" />
                <span className="text-white">Solid: Past Track</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b border-dashed border-[#FF4D4D]" />
                <span className="text-white">Dashed: Projected +60m Track</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
