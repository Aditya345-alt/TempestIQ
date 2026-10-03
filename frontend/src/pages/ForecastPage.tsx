import React from 'react';
import {
  Calendar,
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useWeather } from '../hooks/useWeatherData';
import { DataSourceBadge, RiskBadge } from '../components/common/RiskBadge';
import { AtmosphericTimelineChart } from '../charts/AtmosphericTimelineChart';

export const ForecastPage: React.FC = () => {
  const { selectedLocation } = useLocationContext();
  const { forecast, loading } = useWeather(selectedLocation);

  if (loading && !forecast) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#00D5E5]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin mr-3" />
        Generating Multi-Horizon Atmospheric Forecast...
      </div>
    );
  }

  const horizons = forecast?.forecast_horizons || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Atmospheric Convective Forecast: {selectedLocation}
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#073B3C] border border-[#087F80] text-[#00D5E5]">
              0–24H OUTLOOK
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Nowcasting coupled with High-Resolution Numerical Weather Prediction model data
          </p>
        </div>

        <DataSourceBadge
          source={forecast?.data_source || 'NWP Model Ensemble & Sensor Fusion'}
          isDemo={forecast?.is_demo ?? true}
        />
      </div>

      {/* 8 Forecast Horizons Grid (Now, 30m, 60m, 120m, 3h, 6h, 12h, 24h) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {horizons.map((h, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border transition-all ${
              h.thunderstorm_prob >= 75
                ? 'bg-[#061418] border-[#FF4D4D]/60 shadow-[0_0_20px_rgba(255,77,77,0.15)]'
                : h.thunderstorm_prob >= 50
                ? 'bg-[#061418] border-[#FF9F43]/50'
                : 'bg-[#061418] border-[#073B3C]/80'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#073B3C]/60 mb-3">
              <span className="font-mono text-base font-bold text-white tracking-wider">
                {h.time}
              </span>
              <RiskBadge
                level={h.thunderstorm_prob >= 75 ? 'SEVERE' : h.thunderstorm_prob >= 50 ? 'HIGH' : h.thunderstorm_prob >= 25 ? 'MODERATE' : 'LOW'}
              />
            </div>

            <div className="text-sm font-semibold text-cyan-300 mb-3">{h.condition}</div>

            <div className="space-y-2 text-xs font-mono text-[#9BAEB1]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#00D5E5]" />
                  <span>Temperature</span>
                </span>
                <span className="text-white font-bold">{h.temp_c}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Humidity</span>
                </span>
                <span className="text-white font-bold">{h.humidity_pct}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  <span>Wind Speed</span>
                </span>
                <span className="text-white font-bold">{h.wind_kmh} km/h</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  <span>Rainfall Acc</span>
                </span>
                <span className="text-white font-bold">{h.rainfall_mm} mm</span>
              </div>

              <div className="pt-2 border-t border-[#073B3C]/50 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#FF9F43]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Thunderstorm</span>
                </span>
                <span className="text-[#FF9F43] font-bold">{h.thunderstorm_prob}%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#00D5E5]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Lightning Risk</span>
                </span>
                <span className="text-[#00D5E5] font-bold">{h.lightning_risk}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Chart */}
      <AtmosphericTimelineChart timeline={forecast?.timeline || []} />
    </div>
  );
};
