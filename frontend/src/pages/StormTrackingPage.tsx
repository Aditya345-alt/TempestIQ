import React, { useState } from 'react';
import {
  Wind,
  Navigation,
  Activity,
  Compass,
  Gauge,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useStorms } from '../hooks/useWeatherData';
import { InteractiveAtmosphericMap } from '../maps/InteractiveAtmosphericMap';
import { RiskBadge, DataSourceBadge } from '../components/common/RiskBadge';

export const StormTrackingPage: React.FC = () => {
  const { selectedLocation, coordinates } = useLocationContext();
  const { storms, loading } = useStorms(selectedLocation);

  const [selectedStormId, setSelectedStormId] = useState<number>(1);

  if (loading && !storms) {
    return (
      <div className="flex h-96 items-center justify-center font-mono text-[#00D5E5]">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D5E5] border-t-transparent animate-spin mr-3" />
        Tracking Convective Storm Centroids & Extrapolations...
      </div>
    );
  }

  const stormList = storms?.storms || [];
  const activeStorm = stormList.find((s) => s.id === selectedStormId) || stormList[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2 border-b border-[#073B3C]/80">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">
              Convective Storm Tracking & Extrapolation
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#FF4D4D]/20 border border-[#FF4D4D]/50 text-[#FF4D4D]">
              {storms?.total_active_storms ?? 0} ACTIVE CELLS
            </span>
          </div>
          <p className="text-xs font-mono text-[#9BAEB1] mt-1">
            Tracking Algorithm: Cross-Correlation Centroid Tracking & Velocity-Azimuth Display (SCIT/TITAN-Derived)
          </p>
        </div>

        <DataSourceBadge
          source={storms?.data_source || 'Multi-Radar Tracking Grid'}
          isDemo={true}
          lastUpdated={storms?.last_updated}
        />
      </div>

      {/* Main Grid: Map & Active Storm Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map with Tracks */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#9BAEB1]">
            <span className="text-white font-medium">Multi-Track Spatial Extrapolation</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#00D5E5]" />
                <span>Observed Path</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#FF4D4D]" />
                <span>Predicted Path (60m)</span>
              </span>
            </div>
          </div>

          <InteractiveAtmosphericMap
            centerLat={activeStorm ? activeStorm.latitude : coordinates.lat}
            centerLon={activeStorm ? activeStorm.longitude : coordinates.lon}
            zoom={9}
            storms={stormList}
            className="h-[480px] w-full"
          />
        </div>

        {/* Storm Selector & Telemetry Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-mono text-[#9BAEB1] uppercase tracking-wider">
              Identified Convective Cells
            </div>
            {stormList.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStormId(st.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedStormId === st.id
                    ? 'bg-[#073B3C]/50 border-[#00D5E5] shadow-[0_0_15px_rgba(0,213,229,0.2)]'
                    : 'bg-[#061418] border-[#073B3C]/80 hover:border-[#087F80]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{st.name}</div>
                  <RiskBadge level={st.severity} />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#9BAEB1] mt-1.5">
                  <span>{st.storm_code}</span>
                  <span className="text-[#00D5E5]">{st.intensity_dbz} dBZ</span>
                  <span>{st.speed_kmh} km/h @ {st.direction_deg}°</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Selected Storm Inspection (Section 15 requirements) */}
          {activeStorm && (
            <div className="p-5 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-xl space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#073B3C]">
                <div>
                  <h3 className="font-bold text-white text-sm">{activeStorm.storm_code}</h3>
                  <div className="text-[10px] text-[#9BAEB1]">{activeStorm.name}</div>
                </div>
                <span className="text-[#00D5E5] font-bold">
                  AI Confidence: {(activeStorm.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <div className="space-y-2.5 text-[#9BAEB1]">
                <div className="p-2.5 rounded-lg bg-[#073B3C]/30 flex justify-between items-center">
                  <span>CURRENT POSITION:</span>
                  <span className="text-white font-bold">
                    {activeStorm.latitude.toFixed(3)}°N, {activeStorm.longitude.toFixed(3)}°E
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#073B3C]/30 flex justify-between items-center">
                  <span>MOVEMENT VECTOR:</span>
                  <span className="text-[#00D5E5] font-bold">
                    {activeStorm.speed_kmh} km/h towards {activeStorm.direction_deg}° (NE)
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#073B3C]/30 flex justify-between items-center">
                  <span>PEAK CORE REFLECTIVITY:</span>
                  <span className="text-[#FF4D4D] font-bold">{activeStorm.intensity_dbz} dBZ</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#073B3C]/30 flex justify-between items-center">
                  <span>SYNOPTIC TIMESTAMP:</span>
                  <span className="text-white">{activeStorm.timestamp}</span>
                </div>
              </div>

              {/* Waypoint Intercept Schedule */}
              <div className="pt-2 border-t border-[#073B3C]/60 space-y-1.5">
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                  PREDICTED PATH INTERCEPTS
                </div>
                {activeStorm.predicted_path?.map((pt, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-[#9BAEB1]">
                    <span>+{ (idx + 1) * 15 } min ({pt.timestamp})</span>
                    <span className="text-white">
                      {pt.latitude.toFixed(3)}°N, {pt.longitude.toFixed(3)}°E
                    </span>
                    <span className="text-[#FF9F43]">{pt.intensity_dbz} dBZ</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
