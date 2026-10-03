import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Layers,
  Cpu,
  Clock,
  TrendingUp,
  Wind,
  Shield,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useNowcast, useStorms, useLightning } from '../hooks/useWeatherData';
import { nowcastService } from '../services';
import { RiskBadge, DataSourceBadge } from '../components/common/RiskBadge';
import { InteractiveAtmosphericMap } from '../maps/InteractiveAtmosphericMap';
import type { NowcastData } from '../types';

export const NowcastingPage: React.FC = () => {
  const { selectedLocation, coordinates } = useLocationContext();
  const { nowcast: initialNowcast, loading } = useNowcast(selectedLocation);
  const { storms } = useStorms(selectedLocation);
  const { lightning } = useLightning(selectedLocation);

  const [activeData, setActiveData] = useState<NowcastData | null>(null);
  const [showSimControls, setShowSimControls] = useState(false);
  const [predicting, setPredicting] = useState(false);

  // Interactive Feature Sliders
  const [cape, setCape] = useState(2450);
  const [dbz, setDbz] = useState(54.5);
  const [ltgStrikes, setLtgStrikes] = useState(42);
  const [coolingRate, setCoolingRate] = useState(-12.4);

  const nowcast = activeData || initialNowcast;

  const handleRunCustomPrediction = async () => {
    setPredicting(true);
    try {
      const res = await nowcastService.predict({
        location: selectedLocation,
        latitude: coordinates.lat,
        longitude: coordinates.lon,
        nwp_cape_j_kg: cape,
        radar_reflectivity_dbz: dbz,
        lightning_strikes_15m: ltgStrikes,
        cloud_cooling_rate_k_hr: coolingRate,
      });
      setActiveData(res);
    } catch (err) {
      console.error('Custom prediction error:', err);
    } finally {
      setPredicting(false);
    }
  };

  const handleReset = () => {
    setActiveData(null);
    setCape(2450);
    setDbz(54.5);
    setLtgStrikes(42);
    setCoolingRate(-12.4);
  };

  if (loading && !nowcast) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 font-mono text-[#00D5E5]">
          <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin" />
          <span>Computing multi-sensor convective nowcasting horizons...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Thunderstorm Nowcasting: {selectedLocation}
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#00D5E5]/20 border border-[#00D5E5]/50 text-[#00D5E5]">
              MODEL {nowcast?.model_status || 'TRAINED'}
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Engine: {nowcast?.model_name || 'TempestIQ Multi-Sensor XGBoost'} (v{nowcast?.model_version || '1.0.0'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSimControls(!showSimControls)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#073B3C]/50 border border-[#087F80]/50 text-xs font-mono text-[#00D5E5] hover:border-[#00D5E5] transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSimControls ? 'Hide ML Param Tuner' : 'Simulate Atmospheric Features'}</span>
          </button>
          <DataSourceBadge
            source={nowcast?.data_sources?.[0] || 'Multi-Radar & Satellite Ingest'}
            isDemo={nowcast?.is_demo ?? true}
            statusLabel={nowcast?.model_status}
            lastUpdated={nowcast?.generated_at}
          />
        </div>
      </div>

      {/* Interactive ML Parameter Tuner Drawer */}
      {showSimControls && (
        <div className="p-5 rounded-2xl bg-[#073B3C]/30 border border-[#00D5E5]/40 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#087F80]/30">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00D5E5]" />
              <h3 className="font-bold text-white text-sm">
                Interactive Model Inference: Tweak Convective Indices
              </h3>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-mono text-[#9BAEB1] hover:text-white"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[#9BAEB1] mb-1">
                <span>CAPE (Instability):</span>
                <span className="text-[#FF9F43] font-bold">{cape} J/kg</span>
              </div>
              <input
                type="range"
                min="200"
                max="4500"
                step="50"
                value={cape}
                onChange={(e) => setCape(Number(e.target.value))}
                className="w-full accent-[#00D5E5]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#9BAEB1] mb-1">
                <span>Radar Reflectivity:</span>
                <span className="text-[#FF4D4D] font-bold">{dbz} dBZ</span>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="1"
                value={dbz}
                onChange={(e) => setDbz(Number(e.target.value))}
                className="w-full accent-[#FF4D4D]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#9BAEB1] mb-1">
                <span>15m Lightning Strikes:</span>
                <span className="text-[#00D5E5] font-bold">{ltgStrikes}</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="5"
                value={ltgStrikes}
                onChange={(e) => setLtgStrikes(Number(e.target.value))}
                className="w-full accent-[#00D5E5]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#9BAEB1] mb-1">
                <span>Cloud Cooling Rate:</span>
                <span className="text-cyan-300 font-bold">{coolingRate} K/hr</span>
              </div>
              <input
                type="range"
                min="-30"
                max="5"
                step="0.5"
                value={coolingRate}
                onChange={(e) => setCoolingRate(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunCustomPrediction}
              disabled={predicting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#087F80] to-[#00D5E5] text-[#061418] text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,213,229,0.4)] hover:shadow-[0_0_20px_rgba(0,213,229,0.7)] transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{predicting ? 'Executing XGBoost Inference...' : 'Run Real-Time Prediction'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 3 Forecast Horizons Grid (Section 8 requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nowcast?.horizons?.map((h, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#061418] border border-[#073B3C]/80 relative overflow-hidden shadow-xl hover:border-[#00D5E5]/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#073B3C]/50 border border-[#087F80]/40 text-[#00D5E5]">
                {h.horizon}
              </span>
              <RiskBadge level={h.risk_level} />
            </div>

            <div className="text-5xl font-mono font-bold text-white mb-2">{h.probability}%</div>
            
            <div className="space-y-2 text-xs font-mono pt-3 border-t border-[#073B3C]/50 text-[#9BAEB1]">
              <div className="flex justify-between">
                <span>AI Confidence:</span>
                <span className="text-[#00D5E5] font-bold">{h.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span>Valid At:</span>
                <span className="text-white">{h.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: Animated Risk Map + Storm Development Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Animated Risk Map */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-base">Projected Convective Risk Map</h3>
            <span className="text-xs font-mono text-[#9BAEB1]">Horizon: Next 60 Minutes</span>
          </div>

          <InteractiveAtmosphericMap
            centerLat={coordinates.lat}
            centerLon={coordinates.lon}
            zoom={9}
            storms={storms?.storms || []}
            lightningStrikes={lightning?.observed_strikes || []}
            thunderstormProb={nowcast?.horizons?.[0]?.probability ?? 78}
            className="h-[420px] w-full"
          />
        </div>

        {/* Storm Development Timeline */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-base">Cell Development Lifecycle</h3>
            <span className="text-xs font-mono text-[#00D5E5]">CELL-01 EVOLUTION</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-3">
            {nowcast?.development_timeline?.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-[#073B3C]/20 border border-[#087F80]/20 text-xs font-mono"
              >
                <div className="flex flex-col items-center">
                  <span className="w-2 h-2 rounded-full bg-[#00D5E5] mt-1" />
                  {idx < (nowcast.development_timeline.length - 1) && (
                    <span className="w-0.5 h-8 bg-[#087F80]/40 my-1" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-white">
                    <span className="font-bold">{step.time}</span>
                    <span className="text-[#FF9F43]">{step.intensity_dbz} dBZ</span>
                  </div>
                  <div className="text-cyan-300 font-medium">{step.state}</div>
                  <div className="text-[11px] text-[#9BAEB1]">
                    Echo Top: {step.echo_top_km} km | Speed: {step.movement_speed_kmh} km/h @ {step.movement_direction_deg}°
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
