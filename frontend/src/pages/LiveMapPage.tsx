import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Crosshair,
  Radio,
  Satellite,
  CloudLightning,
  AlertTriangle,
  Wind,
  Layers,
  Sparkles,
  RefreshCw,
  Compass,
  Filter,
} from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { InteractiveAtmosphericMap } from '../maps/InteractiveAtmosphericMap';
import { DataStatusBar } from '../components/map/DataStatusBar';
import { AtmosphericTimelinePlayer } from '../components/map/AtmosphericTimelinePlayer';
import { LocationSearchBar } from '../components/map/LocationSearchBar';
import { LocationDetailPanel, InspectorItem } from '../components/map/LocationDetailPanel';
import { MapLayersLegend } from '../components/map/MapLayersLegend';
import { indiaMapService } from '../services/indiaMapService';
import type {
  RadarStation,
  RadarCompositeFrame,
  ObservedStrike,
  TrackedStorm,
  RiskZone,
  SystemDataStatus,
  LayerVisibility,
  LocationSearchResult,
} from '../types/indiaMap';

export const LiveMapPage: React.FC = () => {
  const { selectedLocation, setSelectedLocation } = useLocationContext();

  // Core Data States
  const [dataStatus, setDataStatus] = useState<SystemDataStatus | null>(null);
  const [indiaBoundary, setIndiaBoundary] = useState<any>(null);
  const [indiaStates, setIndiaStates] = useState<any>(null);
  const [indiaDistricts, setIndiaDistricts] = useState<any>(null);
  const [radarStations, setRadarStations] = useState<RadarStation[]>([]);
  const [activeStorms, setActiveStorms] = useState<TrackedStorm[]>([]);
  const [observedStrikes, setObservedStrikes] = useState<ObservedStrike[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);

  // Timeline & Playback
  const [timeOffsetMin, setTimeOffsetMin] = useState<number>(0);
  const [radarFrames, setRadarFrames] = useState<Record<number, RadarCompositeFrame>>({});
  const [currentRadarFrame, setCurrentRadarFrame] = useState<RadarCompositeFrame | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Inspector & Map Navigation
  const [inspectedItem, setInspectedItem] = useState<InspectorItem | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lon: number; zoom?: number } | null>(null);

  // Layer Visibility State
  const [layers, setLayers] = useState<LayerVisibility>({
    basemap: 'satellite',
    indiaBorder: true,
    states: true,
    districts: false,
    radarComposite: true,
    radarStations: false,
    radarRings: false,
    observedLightning: true,
    predictedRiskZones: true,
    satelliteIR: false,
    stormTracks: true,
    cities: false,
    satelliteClouds: true,
    cyclones: true,
    windStreamlines: true,
    weatherBadges: true,
    stateLabels: true,
  });

  const handleToggleLayer = (key: keyof LayerVisibility, value?: any) => {
    setLayers((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  // Initial Data Fetch
  const loadCoreData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const [
        statusRes,
        boundaryRes,
        statesRes,
        districtsRes,
        stationsRes,
        stormsRes,
        strikesRes,
        riskRes,
      ] = await Promise.allSettled([
        indiaMapService.getSystemDataStatus(),
        indiaMapService.getIndiaBoundary(),
        indiaMapService.getIndiaStates(),
        indiaMapService.getIndiaDistricts(),
        indiaMapService.getRadarStations(),
        indiaMapService.getActiveStorms(),
        indiaMapService.getObservedLightning(60),
        indiaMapService.getRiskGrid(),
      ]);

      if (statusRes.status === 'fulfilled') setDataStatus(statusRes.value);
      if (boundaryRes.status === 'fulfilled') setIndiaBoundary(boundaryRes.value);
      if (statesRes.status === 'fulfilled') setIndiaStates(statesRes.value);
      if (districtsRes.status === 'fulfilled') setIndiaDistricts(districtsRes.value);
      if (stationsRes.status === 'fulfilled') setRadarStations(stationsRes.value);
      if (stormsRes.status === 'fulfilled') setActiveStorms(stormsRes.value.storm_cells);
      if (strikesRes.status === 'fulfilled') setObservedStrikes(strikesRes.value.strikes);
      if (riskRes.status === 'fulfilled') setRiskZones(riskRes.value.zones);

      // Load radar animation frames
      const frames = await indiaMapService.getRadarAnimationFrames();
      const framesMap: Record<number, RadarCompositeFrame> = {};
      frames.forEach((f) => {
        framesMap[f.offset_minutes] = f;
      });
      setRadarFrames(framesMap);
      setCurrentRadarFrame(framesMap[0] || frames[frames.length - 3] || null);
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoreData();
  }, [loadCoreData]);

  // Handle Timeline Scrubbing
  const handleOffsetChange = async (offsetMin: number) => {
    setTimeOffsetMin(offsetMin);
    if (radarFrames[offsetMin]) {
      setCurrentRadarFrame(radarFrames[offsetMin]);
    } else {
      try {
        const frame = await indiaMapService.getCompositeRadar(offsetMin);
        setRadarFrames((prev) => ({ ...prev, [offsetMin]: frame }));
        setCurrentRadarFrame(frame);
      } catch (err) {
        console.error('Error fetching frame:', err);
      }
    }
  };

  // Handle Location Search Selection
  const handleSelectSearchResult = (result: LocationSearchResult) => {
    setFlyToTarget({
      lat: result.lat,
      lon: result.lon,
      zoom: result.type === 'CITY' ? 10 : result.type === 'DISTRICT' ? 9 : 7,
    });

    if (result.type === 'STATE') {
      const stateProps = indiaStates?.features?.find(
        (f: any) => f.properties.name.toLowerCase() === result.name.toLowerCase()
      )?.properties;
      setInspectedItem({
        type: 'STATE',
        data: stateProps || { name: result.name, thunderstorm_risk: result.risk_level },
      });
    } else if (result.type === 'DISTRICT') {
      const distProps = indiaDistricts?.features?.find(
        (f: any) => f.properties.name.toLowerCase() === result.name.toLowerCase()
      )?.properties;
      setInspectedItem({
        type: 'DISTRICT',
        data: distProps || { name: result.name, state: result.state, risk_level: result.risk_level },
      });
    } else {
      setSelectedLocation(result.name, result.lat, result.lon);
      setInspectedItem({
        type: 'COORDINATE',
        data: { lat: result.lat, lon: result.lon },
      });
    }
  };

  // Quick Sector Jumps
  const handleSectorJump = (sector: string) => {
    switch (sector) {
      case 'ALL_INDIA':
        setFlyToTarget({ lat: 22.5937, lon: 78.9629, zoom: 5 });
        break;
      case 'CENTRAL_MP':
        setFlyToTarget({ lat: 23.3, lon: 78.0, zoom: 7 });
        break;
      case 'EAST_BENGAL':
        setFlyToTarget({ lat: 22.8, lon: 88.3, zoom: 8 });
        break;
      case 'NORTH_NCR':
        setFlyToTarget({ lat: 27.8, lon: 78.5, zoom: 7 });
        break;
      case 'MAHARASHTRA':
        setFlyToTarget({ lat: 20.5, lon: 77.5, zoom: 7 });
        break;
      case 'NORTHEAST':
        setFlyToTarget({ lat: 26.2, lon: 92.5, zoom: 7 });
        break;
    }
  };

  return (
    <div className="space-y-3 h-[calc(100vh-5.5rem)] flex flex-col font-sans select-none">
      {/* 1. Top System Telemetry Bar */}
      <div className="shrink-0">
        <DataStatusBar status={dataStatus} />
      </div>

      {/* 2. Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Search Bar */}
        <div className="flex-1 min-w-[280px] max-w-md">
          <LocationSearchBar onSelectLocation={handleSelectSearchResult} />
        </div>

        {/* Sector Quick Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 font-mono text-xs">
          <span className="text-[#9BAEB1] text-[10px] hidden xl:inline uppercase mr-1">Sector:</span>
          {[
            { id: 'ALL_INDIA', label: 'All India' },
            { id: 'CENTRAL_MP', label: 'Central (MP)' },
            { id: 'EAST_BENGAL', label: 'East (Bengal)' },
            { id: 'NORTH_NCR', label: 'North (UP/NCR)' },
            { id: 'MAHARASHTRA', label: 'Vidarbha (MH)' },
            { id: 'NORTHEAST', label: 'Northeast' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => handleSectorJump(sec.id)}
              className="px-2.5 py-1 rounded-lg bg-[#082226] text-[#9BAEB1] hover:text-white hover:bg-[#073B3C] border border-[#087F80]/40 transition-colors whitespace-nowrap text-[11px]"
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Refresh & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadCoreData()}
            disabled={isDataLoading}
            className="p-1.5 rounded-lg bg-[#082226] border border-[#087F80]/50 text-[#00D5E5] hover:bg-[#073B3C] transition-all"
            title="Refresh Ingest Streams"
          >
            <RefreshCw className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Main Full-Screen Map Container */}
      <div className="flex-1 w-full min-h-[420px] relative rounded-2xl overflow-hidden border border-[#087F80]/40 shadow-2xl">
        <InteractiveAtmosphericMap
          centerLat={22.5937}
          centerLon={78.9629}
          zoom={5}
          layers={layers}
          radarFrame={currentRadarFrame}
          radarStations={radarStations}
          observedStrikes={observedStrikes}
          activeStorms={activeStorms}
          riskZones={riskZones}
          indiaBoundaryGeoJson={indiaBoundary}
          indiaStatesGeoJson={indiaStates}
          indiaDistrictsGeoJson={indiaDistricts}
          onSelectItem={(item) => setInspectedItem(item)}
          flyToTarget={flyToTarget}
          className="h-full w-full"
        />

        {/* Floating Location Detail Inspector Panel */}
        <LocationDetailPanel
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
          onFlyTo={(lat, lon, zoom) => setFlyToTarget({ lat, lon, zoom })}
        />

        {/* Floating Collapsible Layers & Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] max-w-sm sm:max-w-md">
          <MapLayersLegend
            layers={layers}
            onToggleLayer={handleToggleLayer}
          />
        </div>
      </div>

      {/* 4. Bottom Atmospheric Timeline Scrubber */}
      <div className="shrink-0">
        <AtmosphericTimelinePlayer
          currentOffsetMin={timeOffsetMin}
          onOffsetChange={handleOffsetChange}
          isLoading={isDataLoading}
        />
      </div>
    </div>
  );
};
