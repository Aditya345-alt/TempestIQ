import type {
  RadarStation,
  RadarCompositeFrame,
  LightningNationalSummary,
  TrackedStorm,
  RiskZone,
  LocationSearchResult,
  SystemDataStatus,
  IndiaCity,
} from '../types/indiaMap';

const API_BASE = '/api';

async function fetchJson<T>(url: string, fallbackPath?: string): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    if (fallbackPath) {
      const fallback = await fetch(fallbackPath);
      return await fallback.json();
    }
    throw err;
  }
}

export const indiaMapService = {
  // 1. Data Status
  async getSystemDataStatus(): Promise<SystemDataStatus> {
    return fetchJson<SystemDataStatus>(`${API_BASE}/data-status`);
  },

  // 2. Geographic boundaries
  async getIndiaBoundary(): Promise<any> {
    return fetchJson(`${API_BASE}/map/india`, '/geo/india_boundary.geojson');
  },

  async getIndiaStates(): Promise<any> {
    return fetchJson(`${API_BASE}/map/states`, '/geo/india_states.geojson');
  },

  async getIndiaDistricts(state?: string): Promise<any> {
    const url = state ? `${API_BASE}/map/districts?state=${encodeURIComponent(state)}` : `${API_BASE}/map/districts`;
    return fetchJson(url, '/geo/india_districts.geojson');
  },

  async getIndiaCities(): Promise<IndiaCity[]> {
    return fetchJson<IndiaCity[]>(`${API_BASE}/map/cities`, '/geo/india_cities.json');
  },

  async searchLocations(q: string): Promise<LocationSearchResult[]> {
    if (!q || q.length < 2) return [];
    return fetchJson<LocationSearchResult[]>(`${API_BASE}/map/search?q=${encodeURIComponent(q)}`);
  },

  // 3. Radar Network
  async getRadarStations(): Promise<RadarStation[]> {
    return fetchJson<RadarStation[]>(`${API_BASE}/radar/stations`, '/geo/radar_network.json');
  },

  async getCompositeRadar(offsetMin: number = 0): Promise<RadarCompositeFrame> {
    return fetchJson<RadarCompositeFrame>(`${API_BASE}/radar/current?offset_min=${offsetMin}`);
  },

  async getRadarAnimationFrames(): Promise<RadarCompositeFrame[]> {
    return fetchJson<RadarCompositeFrame[]>(`${API_BASE}/radar/animation`);
  },

  // 4. Lightning
  async getObservedLightning(lookbackMin: number = 60): Promise<LightningNationalSummary> {
    return fetchJson<LightningNationalSummary>(`${API_BASE}/lightning/recent?lookback_min=${lookbackMin}`);
  },

  // 5. Storm Tracking
  async getActiveStorms(): Promise<{ storm_cells: TrackedStorm[]; active_cells_count: number }> {
    return fetchJson(`${API_BASE}/storms/current`);
  },

  // 6. AI Convective Risk Grid
  async getRiskGrid(): Promise<{ zones: RiskZone[]; active_risk_zones_count: number }> {
    return fetchJson(`${API_BASE}/nowcast/grid`);
  },

  async getLocationRisk(lat: number, lon: number): Promise<any> {
    return fetchJson(`${API_BASE}/nowcast/location-risk?lat=${lat}&lon=${lon}`);
  },
};
