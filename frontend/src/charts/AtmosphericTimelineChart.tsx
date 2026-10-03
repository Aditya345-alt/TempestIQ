import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { TimelinePoint } from '../types';

interface AtmosphericTimelineChartProps {
  timeline: TimelinePoint[];
}

export const AtmosphericTimelineChart: React.FC<AtmosphericTimelineChartProps> = ({ timeline }) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'thunderstorm' | 'lightning' | 'rainfall' | 'intensity'>('all');

  return (
    <div className="p-4 md:p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            Atmospheric Evolution Timelines
          </h3>
          <p className="text-xs text-[#9BAEB1] font-mono">
            Past observations (-2h) and extrapolated nowcast trend (+4h)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#073B3C]/40 border border-[#087F80]/30 text-xs font-mono">
          <button
            onClick={() => setActiveMetric('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === 'all'
                ? 'bg-[#00D5E5] text-[#061418] font-bold shadow-[0_0_10px_rgba(0,213,229,0.4)]'
                : 'text-[#9BAEB1] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMetric('thunderstorm')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === 'thunderstorm'
                ? 'bg-[#FF9F43] text-[#061418] font-bold'
                : 'text-[#9BAEB1] hover:text-white'
            }`}
          >
            Thunderstorm %
          </button>
          <button
            onClick={() => setActiveMetric('lightning')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === 'lightning'
                ? 'bg-[#00D5E5] text-[#061418] font-bold'
                : 'text-[#9BAEB1] hover:text-white'
            }`}
          >
            Lightning Risk %
          </button>
          <button
            onClick={() => setActiveMetric('rainfall')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === 'rainfall'
                ? 'bg-[#3b82f6] text-white font-bold'
                : 'text-[#9BAEB1] hover:text-white'
            }`}
          >
            Rainfall (mm)
          </button>
          <button
            onClick={() => setActiveMetric('intensity')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeMetric === 'intensity'
                ? 'bg-[#FF4D4D] text-white font-bold'
                : 'text-[#9BAEB1] hover:text-white'
            }`}
          >
            Storm Intensity
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorThunderstorm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9F43" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#FF9F43" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorLightning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D5E5" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#00D5E5" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#073B3C" opacity={0.4} />
            <XAxis dataKey="time" stroke="#9BAEB1" fontSize={11} tickLine={false} />
            <YAxis stroke="#9BAEB1" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(6, 20, 24, 0.95)',
                borderColor: '#087F80',
                borderRadius: '0.75rem',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 0 15px rgba(0, 213, 229, 0.2)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />

            {(activeMetric === 'all' || activeMetric === 'thunderstorm') && (
              <Area
                type="monotone"
                dataKey="thunderstorm_prob"
                name="Thunderstorm Prob (%)"
                stroke="#FF9F43"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorThunderstorm)"
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'lightning') && (
              <Area
                type="monotone"
                dataKey="lightning_risk"
                name="Lightning Risk (%)"
                stroke="#00D5E5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLightning)"
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'rainfall') && (
              <Area
                type="monotone"
                dataKey="rainfall_mm"
                name="Rainfall (mm)"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRainfall)"
              />
            )}

            {(activeMetric === 'all' || activeMetric === 'intensity') && (
              <Area
                type="monotone"
                dataKey="intensity_score"
                name="Storm Intensity Index"
                stroke="#FF4D4D"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIntensity)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
