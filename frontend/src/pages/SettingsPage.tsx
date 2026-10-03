import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  MapPin,
  Sliders,
  Bell,
  Database,
  Cpu,
  Shield,
  Check,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';

export const SettingsPage: React.FC = () => {
  const { selectedLocation, setSelectedLocation, units, setUnits, allLocations } = useLocationContext();
  const [savedMsg, setSavedMsg] = useState(false);

  // Settings states
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [autoAlerts, setAutoAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [modelType, setModelType] = useState('XGBoost Multi-Sensor Ensemble v1.0');
  const [satelliteProvider, setSatelliteProvider] = useState('INSAT-3DR Rapid Scan (ISRO)');

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-[#073B3C]/80">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
            Platform Configuration & Operational Settings
          </h1>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Customize observing sector, measurement units, alert dispatch thresholds, and sensor ingest providers
          </p>
        </div>

        {savedMsg && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <div className="space-y-6 font-mono text-xs">
        {/* 1. Observation Location & Units */}
        <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#073B3C] text-sm font-bold text-white">
            <MapPin className="w-4 h-4 text-[#00D5E5]" />
            <span>Observation Sector & Units</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#9BAEB1] mb-1">Default Observation Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
              >
                {allLocations.map((loc) => (
                  <option key={loc.id} value={loc.name} className="bg-[#061418]">
                    {loc.name}, {loc.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#9BAEB1] mb-1">Measurement Unit System</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setUnits('metric')}
                  className={`flex-1 py-2 rounded-xl border transition-all ${
                    units === 'metric'
                      ? 'bg-[#00D5E5]/20 border-[#00D5E5] text-[#00D5E5] font-bold'
                      : 'bg-[#073B3C]/20 border-[#087F80]/40 text-[#9BAEB1]'
                  }`}
                >
                  Metric (°C, km/h, mm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnits('imperial')}
                  className={`flex-1 py-2 rounded-xl border transition-all ${
                    units === 'imperial'
                      ? 'bg-[#00D5E5]/20 border-[#00D5E5] text-[#00D5E5] font-bold'
                      : 'bg-[#073B3C]/20 border-[#087F80]/40 text-[#9BAEB1]'
                  }`}
                >
                  Imperial (°F, mph, in)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Model & Inference Settings */}
        <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#073B3C] text-sm font-bold text-white">
            <Cpu className="w-4 h-4 text-[#00D5E5]" />
            <span>AI Model & Nowcasting Algorithms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#9BAEB1] mb-1">Active Machine Learning Model</label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
              >
                <option value="XGBoost Multi-Sensor Ensemble v1.0" className="bg-[#061418]">
                  XGBoost Multi-Sensor Ensemble v1.0 (Active)
                </option>
                <option value="ConvLSTM Spatiotemporal Grid Predictor" className="bg-[#061418]">
                  ConvLSTM Spatiotemporal Grid Predictor (Experimental)
                </option>
                <option value="Physical Convective Heuristic" className="bg-[#061418]">
                  Physical Convective Heuristic (Fallback)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[#9BAEB1] mb-1">Telemetry Refresh Frequency</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#073B3C]/30 border border-[#087F80] text-white outline-none focus:border-[#00D5E5]"
              >
                <option value="15s" className="bg-[#061418]">15 Seconds (Rapid Scan)</option>
                <option value="30s" className="bg-[#061418]">30 Seconds (Standard)</option>
                <option value="60s" className="bg-[#061418]">1 Minute</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Sensor Data Provider Architecture */}
        <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#073B3C] text-sm font-bold text-white">
            <Database className="w-4 h-4 text-[#00D5E5]" />
            <span>Data Ingest Providers & Environmental Credentials</span>
          </div>

          <p className="text-[#9BAEB1] leading-relaxed">
            Provider configurations are loaded securely via backend <code className="text-white">.env</code>. API keys and secret endpoints are intentionally masked from the browser client for security.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-[#073B3C]/20 border border-[#087F80]/30 space-y-1">
              <div className="text-[#00D5E5] font-bold">RADAR_API_URL</div>
              <div className="text-white">Operational Doppler Network (Connected / Sim Mode)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#073B3C]/20 border border-[#087F80]/30 space-y-1">
              <div className="text-[#00D5E5] font-bold">SATELLITE_API_URL</div>
              <div className="text-white">INSAT-3DR / MOSDAC Geostationary Ingest</div>
            </div>
            <div className="p-3 rounded-xl bg-[#073B3C]/20 border border-[#087F80]/30 space-y-1">
              <div className="text-[#00D5E5] font-bold">LIGHTNING_API_URL</div>
              <div className="text-white">Ground Lightning Network (TOA / MDF Ingest)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#073B3C]/20 border border-[#087F80]/30 space-y-1">
              <div className="text-[#00D5E5] font-bold">NWP_ENSEMBLE_FEED</div>
              <div className="text-white">Open-Meteo High-Resolution Ensemble (Active)</div>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#087F80] to-[#00D5E5] text-[#061418] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,213,229,0.4)] hover:scale-105 transition-all"
          >
            Apply Configurations
          </button>
        </div>
      </div>
    </div>
  );
};
