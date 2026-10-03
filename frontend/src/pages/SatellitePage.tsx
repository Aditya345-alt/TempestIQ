import React, { useState } from 'react';
import {
  Satellite as SatelliteIcon,
  Layers,
  Thermometer,
  TrendingUp,
  Eye,
  Droplets,
  Wind,
  Clock,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useSatellite } from '../hooks/useWeatherData';
import { DataSourceBadge } from '../components/common/RiskBadge';

export const SatellitePage: React.FC = () => {
  const { selectedLocation } = useLocationContext();
  const { satellite, loading } = useSatellite(selectedLocation);

  const [activeBand, setActiveBand] = useState<'VIS' | 'TIR' | 'WV'>('TIR');
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(4); // latest (offset 0)

  const frames = satellite?.frames || [];
  const currentFrame = frames[selectedFrameIdx] || frames[frames.length - 1];

  if (loading && !satellite) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#00D5E5]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin mr-3" />
        Ingesting Geostationary Multi-Spectral Satellite Bands...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Satellite Remote Sensing: {selectedLocation} Sector
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#073B3C] border border-[#087F80] text-cyan-300">
              {satellite?.satellite_name || 'INSAT-3DR Rapid Scan'}
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Channels: Visible (0.65µm), Thermal Infrared (10.8µm), Mid-Troposphere Water Vapor (6.7µm)
          </p>
        </div>

        <DataSourceBadge
          source={satellite?.data_source || 'Geostationary Imager'}
          isDemo={satellite?.is_demo ?? true}
          lastUpdated={satellite?.last_updated}
        />
      </div>

      {/* Band Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveBand('VIS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeBand === 'VIS'
                ? 'bg-[#00D5E5] text-[#061418] shadow-[0_0_15px_rgba(0,213,229,0.4)]'
                : 'bg-[#073B3C]/40 text-[#9BAEB1] hover:text-white border border-[#087F80]/30'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visible (0.65 µm)</span>
          </button>
          <button
            onClick={() => setActiveBand('TIR')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeBand === 'TIR'
                ? 'bg-[#FF9F43] text-[#061418] shadow-[0_0_15px_rgba(255,159,67,0.4)]'
                : 'bg-[#073B3C]/40 text-[#9BAEB1] hover:text-white border border-[#087F80]/30'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal IR (10.8 µm)</span>
          </button>
          <button
            onClick={() => setActiveBand('WV')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
              activeBand === 'WV'
                ? 'bg-blue-400 text-[#061418] shadow-[0_0_15px_rgba(96,165,250,0.4)]'
                : 'bg-[#073B3C]/40 text-[#9BAEB1] hover:text-white border border-[#087F80]/30'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Water Vapor (6.7 µm)</span>
          </button>
        </div>

        {/* Timeline Offset Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-[#9BAEB1]" />
          <span className="text-[#9BAEB1]">Scan Timeline:</span>
          {frames.map((f, i) => (
            <button
              key={i}
              onClick={() => setSelectedFrameIdx(i)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedFrameIdx === i
                  ? 'bg-[#00D5E5]/20 border-[#00D5E5] text-[#00D5E5] font-bold'
                  : 'bg-[#073B3C]/20 border-[#087F80]/30 text-[#9BAEB1] hover:text-white'
              }`}
            >
              {f.time_offset_min === 0 ? 'NOW' : `${f.time_offset_min}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Imagery Visualization & Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Synthetic Multispectral Imagery Viewer */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-2xl relative min-h-[440px] flex flex-col justify-between overflow-hidden">
          {/* Multispectral Atmospheric Filter Canvas Representation */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{
              background:
                activeBand === 'TIR'
                  ? 'radial-gradient(circle at 45% 40%, rgba(255, 77, 77, 0.6) 0%, rgba(255, 159, 67, 0.4) 30%, rgba(7, 59, 60, 0.8) 70%)'
                  : activeBand === 'WV'
                  ? 'radial-gradient(circle at 45% 40%, rgba(0, 213, 229, 0.6) 0%, rgba(8, 127, 128, 0.4) 40%, rgba(6, 20, 24, 0.9) 80%)'
                  : 'radial-gradient(circle at 45% 40%, rgba(255, 255, 255, 0.7) 0%, rgba(155, 174, 177, 0.3) 40%, transparent 70%)',
            }}
          />

          <div className="relative z-10 flex items-center justify-between text-xs font-mono text-[#9BAEB1]">
            <span className="text-white font-bold tracking-wider">
              {activeBand === 'TIR'
                ? 'ENHANCED CONVECTIVE THERMAL IR'
                : activeBand === 'WV'
                ? 'TROPOSPHERIC MOISTURE VORTICITY'
                : 'HIGH-RESOLUTION VISIBLE ALBEDO'}
            </span>
            <span className="text-[#00D5E5] font-mono">{currentFrame?.timestamp}</span>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 flex flex-col items-center justify-center my-12 text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-[#073B3C]/60 border border-[#00D5E5]/50 flex items-center justify-center shadow-[0_0_40px_rgba(0,213,229,0.3)] animate-pulse">
              <SatelliteIcon className="w-12 h-12 text-[#00D5E5]" />
            </div>
            <div className="font-serif text-2xl text-white">
              {currentFrame?.cloud_growth_trend || 'Rapid Vertical Growth Detected'}
            </div>
            <p className="text-xs font-mono text-[#9BAEB1] max-w-md">
              Overshooting convective cloud tops piercing equilibrium level. Infrared temperature dropped to{' '}
              <span className="text-[#FF4D4D] font-bold">{currentFrame?.ir_brightness_temp_k} K</span>.
            </p>
          </div>

          {/* Bottom Met Stamp */}
          <div className="relative z-10 grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#061418]/80 border border-[#087F80]/40 text-center font-mono text-xs">
            <div>
              <div className="text-[10px] text-[#9BAEB1]">Cloud Top Temp</div>
              <div className="text-sm font-bold text-[#FF4D4D]">{currentFrame?.ir_brightness_temp_k} K</div>
            </div>
            <div>
              <div className="text-[10px] text-[#9BAEB1]">Cooling Rate</div>
              <div className="text-sm font-bold text-cyan-300">{currentFrame?.cooling_rate_k_hr} K/hr</div>
            </div>
            <div>
              <div className="text-[10px] text-[#9BAEB1]">Echo Top Elevation</div>
              <div className="text-sm font-bold text-white">{currentFrame?.cloud_top_height_km} km</div>
            </div>
          </div>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-4 font-mono text-xs">
            <h3 className="font-bold text-white text-sm">Satellite Convective Diagnostics</h3>

            <div className="space-y-3 text-[#9BAEB1]">
              <div className="p-3 rounded-xl bg-[#073B3C]/30 border border-[#087F80]/30 space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#00D5E5]">Overshooting Top Criterion</div>
                <p className="text-[11px] leading-relaxed">
                  IR Brightness Temperature &lt; 215 K indicates severe updraft capable of producing destructive wind gusts, lightning flash clustering, and heavy precipitation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#073B3C]/30 border border-[#087F80]/30 space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#FF9F43]">Water Vapor Channel Coupling</div>
                <p className="text-[11px] leading-relaxed">
                  Mid-troposphere brightness at {currentFrame?.water_vapor_temp_k} K confirms strong vertical moisture transport from boundary layer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/30 text-xs font-mono space-y-2 text-[#9BAEB1]">
            <div className="text-[11px] font-bold text-[#00D5E5] uppercase">Image Provider Integration</div>
            <p className="leading-relaxed">
              Connect real HDF5/NetCDF4 satellite tiles via <code className="text-white">SATELLITE_API_URL</code>. Compatible with ISRO MOSDAC, EUMETSAT, and NOAA AWS public datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
