import React from 'react';
import {
  CloudLightning,
  Activity,
  Zap,
  ShieldAlert,
  Layers,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useLocationContext } from '../context/LocationContext';
import { useLightning, useStorms } from '../hooks/useWeatherData';
import { InteractiveAtmosphericMap } from '../maps/InteractiveAtmosphericMap';
import { DataSourceBadge } from '../components/common/RiskBadge';
import { useColorGrade } from '../context/ColorGradeContext';

export const LightningPage: React.FC = () => {
  const { selectedLocation, coordinates } = useLocationContext();
  const { lightning, loading } = useLightning(selectedLocation);
  const { storms } = useStorms(selectedLocation);
  const { config } = useColorGrade();

  if (loading && !lightning) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#C084FC]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C084FC] border-t-transparent animate-spin mr-3" />
        Ingesting Real-Time Lightning Network Telemetry...
      </div>
    );
  }

  const timeline = lightning?.timeline || [];

  return (
    <div className="space-y-6 relative">
      {/* Top Banner: RAZE Editorial Title */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#A855F7]/25">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#E879F9] p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
              <div className="w-full h-full bg-[#08070C] rounded-[14px] flex items-center justify-center">
                <CloudLightning className="w-5 h-5 text-[#C084FC]" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-white font-black tracking-tight">
                Lightning Detection & Risk Monitoring
              </h1>
              <p className="text-xs font-mono text-[#A19DB5] mt-0.5">
                Sector: <span className="text-white font-semibold">{selectedLocation}</span> | Array: Time-of-Arrival (TOA) & Convective Charge Fusion
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#A855F7]/15 border border-[#A855F7]/40 text-[#C084FC] shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            LLN HIGH-FREQUENCY SENSOR ARRAY
          </span>
          <DataSourceBadge
            source={lightning?.data_source || 'Lightning Location Network'}
            isDemo={lightning?.is_demo ?? true}
          />
        </div>
      </div>

      {/* Mandatory Safety Notice Banner (RAZE Dark Glass Protocol) */}
      <div className="p-4 rounded-2xl bg-[#0F0D17]/90 border border-amber-500/30 text-xs font-mono text-amber-200/90 flex items-start gap-3 backdrop-blur-md shadow-[0_0_25px_rgba(245,158,11,0.08)]">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="leading-relaxed">
          <span className="font-bold uppercase tracking-wider text-amber-300">
            METEOROLOGICAL SAFETY PROTOCOL:{' '}
          </span>
          Predicted lightning layers represent <span className="underline font-bold text-white">predicted lightning risk</span> based on convective charge separation models. Predicted lightning risk indicates spatial atmospheric vulnerability and is NEVER a guarantee of confirmed strike locations.
        </div>
      </div>

      {/* 5 Top Telemetry Metrics (RAZE Obsidian Cards with Violet Bloom) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
        {/* Strikes (15m) */}
        <div className="raze-card p-4">
          <div className="text-xs text-[#A19DB5] flex items-center justify-between">
            <span>Observed Strikes</span>
            <CloudLightning className="w-4 h-4 text-[#C084FC]" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {lightning?.current_strikes_15m ?? 42}
          </div>
          <div className="text-[10px] text-[#C084FC] mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC] animate-ping" />
            Past 15 Minutes
          </div>
        </div>

        {/* Strike Density */}
        <div className="raze-card p-4">
          <div className="text-xs text-[#A19DB5] flex items-center justify-between">
            <span>Strike Density</span>
            <Activity className="w-4 h-4 text-[#E879F9]" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-[#E879F9] mt-1">
            {lightning?.strike_density_sqkm ?? 0.54}
          </div>
          <div className="text-[10px] text-[#A19DB5] mt-1">flashes / km²</div>
        </div>

        {/* Flash Rate */}
        <div className="raze-card p-4">
          <div className="text-xs text-[#A19DB5] flex items-center justify-between">
            <span>Flash Frequency</span>
            <Zap className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-[#FBBF24] mt-1">
            {lightning?.flash_rate_per_min ?? 2.8}
          </div>
          <div className="text-[10px] text-[#A19DB5] mt-1">flashes / minute</div>
        </div>

        {/* Peak Current */}
        <div className="raze-card p-4">
          <div className="text-xs text-[#A19DB5] flex items-center justify-between">
            <span>Peak Return Current</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {lightning?.peak_current_ka ?? 54.2} <span className="text-sm font-normal text-[#C084FC]">kA</span>
          </div>
          <div className="text-[10px] text-[#A19DB5] mt-1">Severe Return Stroke</div>
        </div>

        {/* Predicted Risk */}
        <div className="raze-card p-4 border-[#A855F7]/40 shadow-[0_0_25px_rgba(168,85,247,0.2)]">
          <div className="text-xs text-[#C084FC] flex items-center justify-between font-bold">
            <span>Predicted Risk</span>
            <ShieldAlert className="w-4 h-4 text-[#E879F9]" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-white mt-1">
            {lightning?.predicted_lightning_risk_pct ?? 68.5}%
          </div>
          <div className="text-[10px] text-[#C084FC] mt-1 font-semibold">
            Convective Vulnerability
          </div>
        </div>
      </div>

      {/* Map & Strikes Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Container */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-white text-base tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
              Observed Strikes & Convective Risk Contours
            </h3>
            <span className="text-xs font-mono text-[#C084FC]">
              Luminous Dots: Real-time LLN Ingest
            </span>
          </div>

          <div className="raze-card overflow-hidden p-1.5 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <InteractiveAtmosphericMap
              centerLat={coordinates.lat}
              centerLon={coordinates.lon}
              zoom={10}
              storms={storms?.storms || []}
              lightningStrikes={lightning?.observed_strikes || []}
              thunderstormProb={75}
              className="h-[460px] w-full rounded-2xl"
            />
          </div>
        </div>

        {/* Recent Strike Log (RAZE Glass Stream) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-white text-base tracking-wide">
              Live Strikes Log
            </h3>
            <span className="text-xs font-mono text-[#A19DB5]">Chronological</span>
          </div>

          <div className="raze-card p-3 max-h-[472px] overflow-y-auto divide-y divide-[#A855F7]/15 font-mono text-xs">
            {lightning?.observed_strikes?.slice(0, 10).map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-[#A19DB5] hover:bg-white/[0.03] px-2 rounded-lg transition-colors">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E879F9] animate-ping" />
                    {s.id}
                  </div>
                  <div className="text-[10px] text-[#A19DB5] mt-0.5">
                    {s.time} | Lat: {s.lat.toFixed(2)}, Lon: {s.lon.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#C084FC] font-bold">{s.peak_current_ka} kA</span>
                  <div className="text-[10px] text-white/70">{s.strike_type} ({s.polarity})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart: Strikes Over Time vs Predicted Risk */}
      <div className="raze-card p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#C084FC]" />
              Lightning Strike Frequency & Predicted Risk Trend
            </h3>
            <p className="text-xs font-mono text-[#A19DB5] mt-0.5">
              Flash counts observed in 5-minute intervals versus model predicted lightning risk percentage
            </p>
          </div>
          <div className="text-xs font-mono text-[#C084FC] bg-[#A855F7]/15 px-3 py-1 rounded-full border border-[#A855F7]/30">
            METEOROLOGICAL HORIZON: 120 MIN
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A855F7" opacity={0.15} />
              <XAxis dataKey="time" stroke="#A19DB5" fontSize={11} tickLine={false} />
              <YAxis stroke="#A19DB5" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 13, 23, 0.95)',
                  borderColor: 'rgba(168, 85, 247, 0.4)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 25px rgba(0,0,0,0.8)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar
                dataKey="strikes_count"
                name="Observed Strikes (count)"
                fill={config.primary}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="predicted_risk_pct"
                name="Predicted Lightning Risk (%)"
                fill={config.accent}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
