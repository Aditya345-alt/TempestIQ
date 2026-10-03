import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sliders,
  Layers,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useRadar, useStorms } from '../hooks/useWeatherData';
import { InteractiveAtmosphericMap } from '../maps/InteractiveAtmosphericMap';
import { DataSourceBadge } from '../components/common/RiskBadge';
import { useColorGrade } from '../context/ColorGradeContext';

export const RadarPage: React.FC = () => {
  const { selectedLocation, coordinates } = useLocationContext();
  const { radar, loading } = useRadar(selectedLocation);
  const { storms } = useStorms(selectedLocation);
  const { config } = useColorGrade();

  const [currentFrameIdx, setCurrentFrameIdx] = useState(3); // default to current (index 3)
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeedMs, setAnimationSpeedMs] = useState(1200);

  const frames = radar?.frames || [];
  const activeFrame = frames[currentFrameIdx] || frames[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && frames.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % frames.length);
      }, animationSpeedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, animationSpeedMs]);

  if (loading && !radar) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#C084FC]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C084FC] border-t-transparent animate-spin mr-3" />
        Loading Doppler Weather Radar scans...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Station Info */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#A855F7]/25">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#E879F9] p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
              <div className="w-full h-full bg-[#08070C] rounded-[14px] flex items-center justify-center">
                <Radio className="w-5 h-5 text-[#C084FC]" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-white font-black tracking-tight">
                Doppler Weather Radar (DWR)
              </h1>
              <p className="text-xs font-mono text-[#A19DB5] mt-0.5">
                Station: {radar?.station_name} | Band: S-Band Polarimetric | Sweep: 0.5° Elevation Scan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444]">
            {radar?.status_label || 'SIMULATED RADAR DATA'}
          </span>
          <DataSourceBadge
            source={radar?.data_source || 'Doppler Weather Radar Network'}
            isDemo={radar?.is_simulated ?? true}
            statusLabel={radar?.status_label}
            lastUpdated={radar?.last_updated}
          />
        </div>
      </div>

      {/* Main Radar Screen + Frame Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Radar Map Canvas */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          <div className="raze-card overflow-hidden p-1 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <InteractiveAtmosphericMap
              centerLat={coordinates.lat}
              centerLon={coordinates.lon}
              zoom={9}
              storms={storms?.storms || []}
              radarPoints={activeFrame?.points || []}
              className="h-[480px] w-full rounded-2xl"
            />
          </div>

          {/* Animation & Timeline Controls Bar */}
          <div className="raze-card p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Playback Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentFrameIdx((prev) => (prev > 0 ? prev - 1 : frames.length - 1))}
                  className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:text-[#C084FC] hover:border-[#C084FC]/50 transition-all"
                  title="Previous scan"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#A855F7] to-[#E879F9] text-white text-xs font-display font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Loop' : 'Play Loop'}</span>
                </button>
                <button
                  onClick={() => setCurrentFrameIdx((prev) => (prev + 1) % frames.length)}
                  className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:text-[#C084FC] hover:border-[#C084FC]/50 transition-all"
                  title="Next scan"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentFrameIdx(3)}
                  className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:text-[#C084FC] hover:border-[#C084FC]/50 transition-all"
                  title="Reset to current frame"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Active Scan Telemetry */}
              <div className="text-xs font-mono text-right">
                <span className="text-[#A19DB5]">Active Frame: </span>
                <span className="text-[#C084FC] font-bold">
                  {activeFrame?.timestamp || 'CURRENT'} ({activeFrame?.time_offset_min > 0 ? `+${activeFrame.time_offset_min}m Projected` : `${activeFrame?.time_offset_min}m`})
                </span>
                <div className="text-[10px] text-[#A19DB5] uppercase tracking-widest mt-0.5">
                  Type: {activeFrame?.frame_type}
                </div>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-6 gap-2 pt-2 border-t border-[#A855F7]/20 text-xs font-mono text-center">
              {frames.map((f, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIdx(i);
                  }}
                  className={`py-2 px-1 rounded-xl transition-all border ${
                    currentFrameIdx === i
                      ? 'bg-[#A855F7]/25 border-[#C084FC] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-white/[0.02] border-white/10 text-[#A19DB5] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div>{f.time_offset_min === 0 ? 'CURRENT' : f.time_offset_min > 0 ? `+${f.time_offset_min}m` : `${f.time_offset_min}m`}</div>
                  <div className="text-[10px] opacity-70">{f.timestamp.slice(0, 5)}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Radar Metrics & Legend */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Reflectivity Scale Legend */}
          <div className="raze-card p-4 space-y-3 font-mono text-xs shadow-xl">
            <h3 className="font-display font-bold text-white text-sm tracking-wide">
              Reflectivity Scale (dBZ)
            </h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#9333ea]" />
                  <span>&gt; 60 dBZ</span>
                </span>
                <span className="text-purple-300">Severe / Large Hail</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#EF4444]" />
                  <span>50 – 60 dBZ</span>
                </span>
                <span className="text-[#EF4444]">Extreme Convective Rain</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                  <span>40 – 50 dBZ</span>
                </span>
                <span className="text-[#F59E0B]">Heavy Rain / Downpour</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#FBBF24]" />
                  <span>30 – 40 dBZ</span>
                </span>
                <span className="text-[#FBBF24]">Moderate Rain</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#10B981]" />
                  <span>20 – 30 dBZ</span>
                </span>
                <span className="text-emerald-300">Light Rain / Virga</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#A855F7]/20 space-y-2 text-[#A19DB5] text-[11px]">
              <div className="flex justify-between">
                <span>Peak Core dBZ:</span>
                <span className="text-[#EF4444] font-bold">{activeFrame?.max_dbz ?? 58.4} dBZ</span>
              </div>
              <div className="flex justify-between">
                <span>Echo Top Height:</span>
                <span className="text-white font-bold">{activeFrame?.echo_top_km ?? 12.8} km</span>
              </div>
              <div className="flex justify-between">
                <span>Range Coverage:</span>
                <span className="text-white font-bold">150 km Radius</span>
              </div>
            </div>
          </div>

          {/* Provider Architecture Notice */}
          <div className="raze-card p-4 space-y-2 text-xs font-mono text-[#A19DB5]">
            <div className="text-[10px] font-bold text-[#C084FC] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Operational Radar Ingest
            </div>
            <p className="leading-relaxed">
              Configured via <code className="text-white bg-white/10 px-1 py-0.5 rounded">RADAR_API_URL</code>. Supports real IMD DWR Nexrad/Iris Level-II formats or simulated convective generators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
