export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EXTREME';

export interface IndiaGeoFeature {
  type: string;
  properties: {
    id: string;
    name: string;
    type?: string;
    capital?: string;
    state?: string;
    headquarters?: string;
    center: [number, number];
    risk_level?: RiskLevel;
    thunderstorm_risk?: RiskLevel;
    active_storms?: number;
    lightning_strikes_15m?: number;
    lightning_strikes_60m?: number;
    thunderstorm_probability?: number;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface IndiaCity {
  name: string;
  state: string;
  district: string;
  lat: number;
  lon: number;
  station_id: string;
  is_capital: boolean;
}

export interface RadarStation {
  id: string;
  name: string;
  station_code: string;
  location: string;
  state: string;
  lat: number;
  lon: number;
  elevation_m: number;
  band: string;
  coverage_km: number;
  surveillance_km: number;
  status: 'OPERATIONAL' | 'STANDBY' | 'MAINTENANCE';
  is_simulated: boolean;
  max_reflectivity_dbz: number;
  radial_velocity_mps: number;
  echo_top_km: number;
  active_cells_detected: number;
  products: string[];
}

export interface RadarPoint {
  lat: number;
  lon: number;
  reflectivity_dbz: number;
  radial_velocity_mps: number;
  echo_top_km: number;
  cluster_name?: string;
}

export interface RadarCompositeFrame {
  timestamp_utc: string;
  time_label: string;
  offset_minutes: number;
  is_projected: boolean;
  data_source: string;
  active_clusters: number;
  points_count: number;
  max_reflectivity_dbz: number;
  points: RadarPoint[];
}

export interface ObservedStrike {
  id: string;
  lat: number;
  lon: number;
  time_utc: string;
  time_display: string;
  seconds_ago: number;
  age_category: 'LAST_5M' | 'LAST_15M' | 'LAST_30M' | 'LAST_60M';
  strike_type: 'CG' | 'IC';
  polarity: string;
  peak_current_ka: number;
  state: string;
  district: string;
}

export interface LightningNationalSummary {
  query_time_utc: string;
  lookback_minutes: number;
  total_strikes: number;
  strikes_last_15m: number;
  cg_strikes_count: number;
  ic_strikes_count: number;
  flash_rate_per_min: number;
  peak_current_max_ka: number;
  source: string;
  detection_confidence: string;
  strikes: ObservedStrike[];
}

export interface StormTrackPoint {
  time_offset_min: number;
  time_display: string;
  lat: number;
  lon: number;
  uncertainty_km?: number;
}

export interface DownstreamETA {
  city: string;
  eta_minutes: number;
  threat: string;
}

export interface TrackedStorm {
  id: string;
  name: string;
  state: string;
  center_lat: number;
  center_lon: number;
  heading_deg: number;
  speed_kmh: number;
  severity: RiskLevel;
  max_reflectivity_dbz: number;
  echo_top_km: number;
  vil_kg_m2: number;
  hail_prob_pct: number;
  wind_gust_kmh: number;
  mesocyclone_detected: boolean;
  impacted_districts: string[];
  downstream_cities_eta: DownstreamETA[];
  past_track: StormTrackPoint[];
  future_track: StormTrackPoint[];
}

export interface RiskZone {
  id: string;
  region_name: string;
  state: string;
  center_lat: number;
  center_lon: number;
  polygon: [number, number][];
  risk_level: RiskLevel;
  risk_score_pct: number;
  predicted_flash_rate_per_min: number;
  cape_j_kg: number;
  lifted_index: number;
  flash_potential_index: number;
  has_observed_lightning: boolean;
  lead_time_min: number;
  threat_summary: string;
}

export interface LocationSearchResult {
  type: 'CITY' | 'DISTRICT' | 'STATE';
  name: string;
  district?: string;
  state: string;
  capital?: string;
  lat: number;
  lon: number;
  label: string;
  risk_level?: RiskLevel;
  is_capital?: boolean;
}

export interface SystemDataStatus {
  system_mode: string;
  timestamp_utc: string;
  status: string;
  sources: {
    radar_network: {
      provider: string;
      total_stations: number;
      operational_stations: number;
      simulated_telemetry: boolean;
      refresh_interval_sec: number;
      latency_min: number;
      status: string;
      badge: string;
    };
    satellite: {
      provider: string;
      bands: string[];
      rapid_scan_enabled: boolean;
      refresh_interval_sec: number;
      latency_min: number;
      status: string;
      badge: string;
    };
    lightning_network: {
      provider: string;
      coverage: string;
      detection_efficiency_pct: number;
      refresh_interval_sec: number;
      latency_sec: number;
      status: string;
      badge: string;
    };
    ai_nowcasting: {
      model_name: string;
      prediction_horizon_min: number;
      spatial_resolution_km: number;
      inference_time_ms: number;
      status: string;
      badge: string;
    };
    geographic_hierarchy: {
      provider: string;
      states_count: number;
      districts_count: number;
      radar_stations_count: number;
      status: string;
      badge: string;
    };
  };
  national_summary: {
    active_severe_storm_cells: number;
    monitored_thunderstorm_clusters: number;
    strikes_recorded_last_15m: number;
    strikes_recorded_last_60m: number;
    highest_risk_state: string;
    highest_risk_district: string;
    max_reflectivity_dbz: number;
    max_wind_gust_kmh: number;
  };
}

export interface LayerVisibility {
  basemap: 'dark_canvas' | 'satellite' | 'terrain';
  indiaBorder: boolean;
  states: boolean;
  districts: boolean;
  radarComposite: boolean;
  radarStations: boolean;
  radarRings: boolean;
  observedLightning: boolean;
  predictedRiskZones: boolean;
  satelliteIR: boolean;
  stormTracks: boolean;
  cities: boolean;
  satelliteClouds?: boolean;
  cyclones?: boolean;
  windStreamlines?: boolean;
  weatherBadges?: boolean;
  stateLabels?: boolean;
}

