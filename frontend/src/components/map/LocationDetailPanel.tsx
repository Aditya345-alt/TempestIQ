import React from 'react';
import {
  X,
  MapPin,
  Radio,
  CloudLightning,
  AlertTriangle,
  Wind,
  ShieldAlert,
  Compass,
  Zap,
  Activity,
  Maximize2,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { RadarStation, TrackedStorm, ObservedStrike, RiskZone } from '../../types/indiaMap';

export type InspectorItem =
  | { type: 'STATE'; data: any }
  | { type: 'DISTRICT'; data: any }
  | { type: 'RADAR'; data: RadarStation }
  | { type: 'STORM'; data: TrackedStorm }
  | { type: 'LIGHTNING'; data: ObservedStrike }
  | { type: 'RISK_ZONE'; data: RiskZone }
  | { type: 'COORDINATE'; data: { lat: number; lon: number; risk?: any } };

interface LocationDetailPanelProps {
  item: InspectorItem | null;
  onClose: () => void;
  onFlyTo?: (lat: number, lon: number, zoom?: number) => void;
}

export const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  item,
  onClose,
  onFlyTo,
}) => {
  if (!item) return null;

  return (
    <div className="absolute bottom-16 right-4 top-20 w-80 md:w-96 bg-[#061418]/95 backdrop-blur-xl border border-[#087F80]/60 rounded-2xl p-4 shadow-2xl z-[1050] flex flex-col font-mono text-xs overflow-hidden animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-[#073B3C] shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00D5E5]/10 border border-[#00D5E5]/30 text-[#00D5E5]">
            {item.type === 'STATE' && <MapPin className="w-4 h-4" />}
            {item.type === 'DISTRICT' && <MapPin className="w-4 h-4 text-emerald-400" />}
            {item.type === 'RADAR' && <Radio className="w-4 h-4 text-[#00D5E5]" />}
            {item.type === 'STORM' && <AlertTriangle className="w-4 h-4 text-[#FF4D4D]" />}
            {item.type === 'LIGHTNING' && <Zap className="w-4 h-4 text-[#FFD166]" />}
            {item.type === 'RISK_ZONE' && <ShieldAlert className="w-4 h-4 text-purple-400" />}
            {item.type === 'COORDINATE' && <Compass className="w-4 h-4 text-cyan-300" />}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#9BAEB1] font-bold">
              {item.type.replace('_', ' ')} TELEMETRY
            </span>
            <h3 className="text-white font-bold text-sm truncate max-w-[210px]">
              {item.type === 'STATE' && item.data.name}
              {item.type === 'DISTRICT' && `${item.data.name} District`}
              {item.type === 'RADAR' && item.data.name}
              {item.type === 'STORM' && item.data.name}
              {item.type === 'LIGHTNING' && `Strike ${item.data.id}`}
              {item.type === 'RISK_ZONE' && item.data.region_name}
              {item.type === 'COORDINATE' && 'Custom Coordinate'}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-[#082226] text-[#9BAEB1] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
        {/* 1. STATE INSPECTOR */}
        {item.type === 'STATE' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Capital City</div>
                <div className="text-white font-bold text-xs mt-0.5">{item.data.capital || 'N/A'}</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Threat Level</div>
                <div
                  className={`font-bold text-xs mt-0.5 ${
                    item.data.thunderstorm_risk === 'SEVERE'
                      ? 'text-red-400'
                      : item.data.thunderstorm_risk === 'HIGH'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {item.data.thunderstorm_risk || 'MODERATE'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#082226] border border-[#087F80]/30 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9BAEB1]">Active Convective Cells:</span>
                <span className="text-white font-bold">{item.data.active_storms || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9BAEB1]">Lightning Flashes (15m):</span>
                <span className="text-[#FFD166] font-bold">{item.data.lightning_strikes_15m || 0}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9BAEB1]">Lightning Flashes (60m):</span>
                <span className="text-white font-bold">{item.data.lightning_strikes_60m || 0}</span>
              </div>
            </div>

            {onFlyTo && item.data.center && (
              <button
                onClick={() => onFlyTo(item.data.center[0], item.data.center[1], 7)}
                className="w-full py-2 rounded-xl bg-[#00D5E5] text-black font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Zoom to State Bounds
              </button>
            )}
          </>
        )}

        {/* 2. DISTRICT INSPECTOR */}
        {item.type === 'DISTRICT' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">State</div>
                <div className="text-white font-bold text-xs mt-0.5">{item.data.state}</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Threat Index</div>
                <div
                  className={`font-bold text-xs mt-0.5 ${
                    item.data.risk_level === 'SEVERE'
                      ? 'text-red-400'
                      : item.data.risk_level === 'HIGH'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {item.data.risk_level || 'LOW'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#082226] border border-[#087F80]/30 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9BAEB1]">HQ:</span>
                <span className="text-white font-semibold">{item.data.headquarters || item.data.name}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#9BAEB1]">Centroid:</span>
                <span className="text-cyan-300 font-mono">
                  {item.data.center ? `${item.data.center[0].toFixed(2)}°N, ${item.data.center[1].toFixed(2)}°E` : 'N/A'}
                </span>
              </div>
            </div>

            {onFlyTo && item.data.center && (
              <button
                onClick={() => onFlyTo(item.data.center[0], item.data.center[1], 10)}
                className="w-full py-2 rounded-xl bg-[#00D5E5] text-black font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Focus on District
              </button>
            )}
          </>
        )}

        {/* 3. RADAR STATION INSPECTOR */}
        {item.type === 'RADAR' && (
          <>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
              <span className="text-[#9BAEB1]">Operational Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {item.data.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Radar Frequency Band</div>
                <div className="text-[#00D5E5] font-bold text-xs mt-0.5">{item.data.band} Band</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Operational Range</div>
                <div className="text-white font-bold text-xs mt-0.5">{item.data.coverage_km} km</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Max Core Reflectivity</div>
                <div className="text-amber-400 font-bold text-xs mt-0.5">{item.data.max_reflectivity_dbz} dBZ</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Echo Top Height</div>
                <div className="text-purple-300 font-bold text-xs mt-0.5">{item.data.echo_top_km} km</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#082226] border border-[#087F80]/30">
              <div className="text-[10px] text-[#9BAEB1] mb-1">Standard Products Delivered:</div>
              <div className="flex flex-wrap gap-1">
                {item.data.products?.map((p) => (
                  <span key={p} className="px-1.5 py-0.5 rounded bg-[#061418] text-[#9BAEB1] text-[9px] border border-[#087F80]/20">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#061418] border border-amber-500/30 text-[10px] text-amber-300 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>DWR simulated data conforming to IMD Doppler radar transmission format.</span>
            </div>

            {onFlyTo && (
              <button
                onClick={() => onFlyTo(item.data.lat, item.data.lon, 9)}
                className="w-full py-2 rounded-xl bg-[#00D5E5] text-black font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Focus Radar Sweeps
              </button>
            )}
          </>
        )}

        {/* 4. STORM CELL INSPECTOR */}
        {item.type === 'STORM' && (
          <>
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/40 text-[#FF4D4D] font-bold">
              <span>Cell Severity:</span>
              <span className="px-2 py-0.5 rounded bg-[#FF4D4D] text-white text-[10px]">
                {item.data.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Heading / Track</div>
                <div className="text-white font-bold text-xs mt-0.5">{item.data.heading_deg}° ({item.data.speed_kmh} km/h)</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Max Core Reflectivity</div>
                <div className="text-red-400 font-bold text-xs mt-0.5">{item.data.max_reflectivity_dbz} dBZ</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Hail Probability</div>
                <div className="text-amber-400 font-bold text-xs mt-0.5">{item.data.hail_prob_pct}%</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Wind Gust Max</div>
                <div className="text-purple-300 font-bold text-xs mt-0.5">{item.data.wind_gust_kmh} km/h</div>
              </div>
            </div>

            {/* Downstream Impact Table */}
            {item.data.downstream_cities_eta && item.data.downstream_cities_eta.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[#082226] border border-[#087F80]/30 space-y-2">
                <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00D5E5]" />
                  Downstream Impact ETAs
                </div>
                <div className="space-y-1.5">
                  {item.data.downstream_cities_eta.map((eta) => (
                    <div key={eta.city} className="flex items-center justify-between text-[11px] bg-[#061418] p-1.5 rounded-lg border border-[#073B3C]">
                      <div>
                        <span className="text-white font-bold">{eta.city}</span>
                        <div className="text-[9px] text-[#9BAEB1]">{eta.threat}</div>
                      </div>
                      <span className="text-[#FF4D4D] font-bold">+{eta.eta_minutes}m ETA</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {onFlyTo && (
              <button
                onClick={() => onFlyTo(item.data.center_lat, item.data.center_lon, 10)}
                className="w-full py-2 rounded-xl bg-[#FF4D4D] text-white font-bold flex items-center justify-center gap-1.5 hover:bg-red-600 transition-colors shadow-[0_0_12px_rgba(255,77,77,0.4)]"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Track Centroid Vector
              </button>
            )}
          </>
        )}

        {/* 5. LIGHTNING STRIKE INSPECTOR */}
        {item.type === 'LIGHTNING' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Discharge Type</div>
                <div className="text-[#FFD166] font-bold text-xs mt-0.5">
                  {item.data.strike_type === 'CG' ? 'Cloud-to-Ground (CG)' : 'Intra-Cloud (IC)'}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Peak Current</div>
                <div className="text-white font-bold text-xs mt-0.5">{item.data.peak_current_ka} kA</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Polarity</div>
                <div className="text-cyan-300 font-bold text-xs mt-0.5">{item.data.polarity}</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Detection Latency</div>
                <div className="text-emerald-400 font-bold text-xs mt-0.5">{item.data.seconds_ago}s ago</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#082226] border border-[#087F80]/30 space-y-1">
              <div className="text-[10px] text-[#9BAEB1]">Location Attribution:</div>
              <div className="text-white font-bold text-xs">{item.data.district}, {item.data.state}</div>
              <div className="text-[10px] font-mono text-cyan-300">
                {item.data.lat.toFixed(4)}°N, {item.data.lon.toFixed(4)}°E
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#061418] border border-[#087F80]/40 text-[10px] text-[#9BAEB1]">
              Recorded by IITM Ground Lightning Detection Network & GLD360 terrestrial sensor feed.
            </div>

            {onFlyTo && (
              <button
                onClick={() => onFlyTo(item.data.lat, item.data.lon, 11)}
                className="w-full py-2 rounded-xl bg-[#FFD166] text-black font-bold flex items-center justify-center gap-1.5 hover:bg-amber-300 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Zoom to Strike Point
              </button>
            )}
          </>
        )}

        {/* 6. RISK ZONE INSPECTOR */}
        {item.type === 'RISK_ZONE' && (
          <>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold">Predicted Risk Level:</span>
                <span className="px-2 py-0.5 rounded bg-purple-500 text-white font-bold text-[10px]">
                  {item.data.risk_level} ({item.data.risk_score_pct}%)
                </span>
              </div>
              <div className="text-[11px] text-white pt-1">{item.data.threat_summary}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Convective CAPE</div>
                <div className="text-white font-bold text-xs mt-0.5">{item.data.cape_j_kg} J/kg</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Lifted Index</div>
                <div className="text-red-400 font-bold text-xs mt-0.5">{item.data.lifted_index}</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Flash Potential (FPI)</div>
                <div className="text-amber-400 font-bold text-xs mt-0.5">{item.data.flash_potential_index} / 10</div>
              </div>
              <div className="p-2 rounded-xl bg-[#082226] border border-[#087F80]/30">
                <div className="text-[10px] text-[#9BAEB1]">Nowcast Horizon</div>
                <div className="text-[#00D5E5] font-bold text-xs mt-0.5">+{item.data.lead_time_min} Minutes</div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#061418] border border-purple-500/30 text-[10px] text-purple-300 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-purple-400" />
              <span>Forecast computed by Tempest-ConvNet v2.4 assimilating multi-radar echoes and thermodynamic soundings.</span>
            </div>

            {onFlyTo && (
              <button
                onClick={() => onFlyTo(item.data.center_lat, item.data.center_lon, 9)}
                className="w-full py-2 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 hover:bg-purple-600 transition-colors shadow-[0_0_12px_rgba(168,85,247,0.4)]"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Focus Convective Zone
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
