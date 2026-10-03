import React, { useEffect, useState } from 'react';
import { Radio, Satellite, CloudLightning, Cpu, MapPin, Activity, Clock, ShieldCheck } from 'lucide-react';
import type { SystemDataStatus } from '../../types/indiaMap';

interface DataStatusBarProps {
  status: SystemDataStatus | null;
  onRefresh?: () => void;
}

export const DataStatusBar: React.FC<DataStatusBarProps> = ({ status }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUTC = (d: Date) => d.toUTCString().slice(17, 25) + ' UTC';
  const formatIST = (d: Date) => {
    const ist = new Date(d.getTime() + 5.5 * 3600 * 1000);
    return ist.toUTCString().slice(17, 22) + ' IST';
  };

  const sources = status?.sources;

  return (
    <div className="w-full bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 rounded-xl px-3.5 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xl text-xs font-mono">
      {/* Left: System Status & Time */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#00D5E5]/10 border border-[#00D5E5]/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D5E5] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D5E5]"></span>
          </span>
          <span className="font-bold text-[#00D5E5] tracking-wide">TEMPEST-IQ OPERATIONAL</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[#9BAEB1] border-l border-[#073B3C] pl-3">
          <Clock className="w-3.5 h-3.5 text-[#00D5E5]" />
          <span className="text-white font-semibold">{formatUTC(now)}</span>
          <span className="opacity-60">({formatIST(now)})</span>
        </div>
      </div>

      {/* Middle: Live Feed Badges */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        {/* Radar */}
        <div className="flex items-center gap-1.5 px-2 py-0.8 rounded-md bg-[#082226] border border-[#087F80]/40 text-[#9BAEB1] text-[11px] whitespace-nowrap" title={sources?.radar_network?.provider || 'IMD DWR'}>
          <Radio className="w-3 h-3 text-[#00D5E5]" />
          <span className="text-white font-medium">RADAR:</span>
          <span className="text-[#00D5E5] font-bold">28/32 DWR</span>
          <span className="text-[10px] opacity-70">({sources?.radar_network?.latency_min || 4.5}m)</span>
        </div>

        {/* Satellite */}
        <div className="flex items-center gap-1.5 px-2 py-0.8 rounded-md bg-[#082226] border border-[#087F80]/40 text-[#9BAEB1] text-[11px] whitespace-nowrap" title={sources?.satellite?.provider || 'INSAT-3DR'}>
          <Satellite className="w-3 h-3 text-cyan-300" />
          <span className="text-white font-medium">SAT:</span>
          <span className="text-cyan-300 font-bold">INSAT-3DR</span>
          <span className="text-[10px] opacity-70">({sources?.satellite?.latency_min || 11}m)</span>
        </div>

        {/* Lightning */}
        <div className="flex items-center gap-1.5 px-2 py-0.8 rounded-md bg-[#082226] border border-[#087F80]/40 text-[#9BAEB1] text-[11px] whitespace-nowrap" title={sources?.lightning_network?.provider || 'IITM/GLD360'}>
          <CloudLightning className="w-3 h-3 text-[#FFD166]" />
          <span className="text-white font-medium">LTG:</span>
          <span className="text-[#FFD166] font-bold">IITM/GLD360</span>
          <span className="text-[10px] text-emerald-400 font-semibold">(18s)</span>
        </div>

        {/* AI Nowcaster */}
        <div className="flex items-center gap-1.5 px-2 py-0.8 rounded-md bg-[#082226] border border-[#087F80]/40 text-[#9BAEB1] text-[11px] whitespace-nowrap" title={sources?.ai_nowcasting?.model_name || 'Tempest ConvNet'}>
          <Cpu className="w-3 h-3 text-purple-400" />
          <span className="text-white font-medium">AI:</span>
          <span className="text-purple-300 font-bold">NOWCAST v2.4</span>
        </div>
      </div>

      {/* Right: National Strike & Cell Counter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-[#9BAEB1]">
          <Activity className="w-3.5 h-3.5 text-[#FF4D4D]" />
          <span>Active Cells:</span>
          <span className="font-bold text-[#FF4D4D]">{status?.national_summary?.active_severe_storm_cells || 6}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#9BAEB1] border-l border-[#073B3C] pl-3">
          <CloudLightning className="w-3.5 h-3.5 text-[#FFD166]" />
          <span>15m Strikes:</span>
          <span className="font-bold text-[#FFD166]">{status?.national_summary?.strikes_recorded_last_15m || 164}</span>
        </div>
      </div>
    </div>
  );
};
