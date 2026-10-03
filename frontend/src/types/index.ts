export interface CurrentWeather {
  location: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  temperature_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  pressure_hpa: number;
  rainfall_mm: number;
  dew_point_c: number;
  condition: string;
  thunderstorm_probability: number;
  lightning_risk: number;
  active_storms_nearby: number;
  cape_j_kg: number;
  cin_j_kg: number;
  shear_mps: number;
  data_source: string;
  is_demo: boolean;
}

export interface TimelinePoint {
  time: string;
  thunderstorm_prob: number;
  lightning_risk: number;
  rainfall_mm: number;
  intensity_score: number;
}

export interface ForecastItem {
  time: string;
  temp_c: number;
  humidity_pct: number;
  wind_kmh: number;
  pressure_hpa: number;
  rainfall_mm: number;
  thunderstorm_prob: number;
  lightning_risk: number;
  condition: string;
}

export interface WeatherForecast {
  location: string;
  timeline: TimelinePoint[];
  forecast_horizons: ForecastItem[];
  data_source: string;
  is_demo: boolean;
}

export interface HorizonPrediction {
  horizon: string;
  probability: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  confidence: number;
  timestamp: string;
}

export interface StormDevelopmentStage {
  time: string;
  cell_id: string;
  state: string;
  intensity_dbz: number;
  echo_top_km: number;
  movement_speed_kmh: number;
  movement_direction_deg: number;
}

export interface NowcastData {
  location: string;
  latitude: number;
  longitude: number;
  generated_at: string;
  model_name: string;
  model_version: string;
  model_status: string;
  horizons: HorizonPrediction[];
  development_timeline: StormDevelopmentStage[];
  atmospheric_indices: Record<string, number>;
  data_sources: string[];
  is_demo: boolean;
}

export interface RadarPoint {
  lat: number;
  lon: number;
  reflectivity_dbz: number;
  velocity_mps: number;
}

export interface RadarFrame {
  timestamp: string;
  time_offset_min: number;
  frame_type: 'historical' | 'current' | 'projected';
  max_dbz: number;
  echo_top_km: number;
  points: RadarPoint[];
}

export interface RadarData {
  station_name: string;
  latitude: number;
  longitude: number;
  range_km: number;
  frames: RadarFrame[];
  data_source: string;
  status_label: string;
  is_simulated: boolean;
  last_updated: string;
}

export interface SatelliteBand {
  band_name: string;
  wavelength_um: number;
  min_val: number;
  max_val: number;
  units: string;
  description: string;
}

export interface SatelliteFrame {
  timestamp: string;
  time_offset_min: number;
  ir_brightness_temp_k: number;
  water_vapor_temp_k: number;
  cloud_top_height_km: number;
  cooling_rate_k_hr: number;
  cloud_growth_trend: string;
}

export interface SatelliteData {
  region_name: string;
  satellite_name: string;
  bands: SatelliteBand[];
  frames: SatelliteFrame[];
  current_metrics: SatelliteFrame;
  data_source: string;
  is_demo: boolean;
  last_updated: string;
}

export interface LightningStrike {
  id: string;
  lat: number;
  lon: number;
  time: string;
  peak_current_ka: number;
  strike_type: 'CG' | 'IC';
  polarity: 'Positive' | 'Negative';
}

export interface StrikeTimeSeries {
  time: string;
  strikes_count: number;
  flash_rate: number;
  predicted_risk_pct: number;
}

export interface LightningData {
  location: string;
  current_strikes_15m: number;
  strike_density_sqkm: number;
  flash_rate_per_min: number;
  peak_current_ka: number;
  recent_activity_trend: string;
  predicted_lightning_risk_pct: number;
  observed_strikes: LightningStrike[];
  timeline: StrikeTimeSeries[];
  data_source: string;
  is_demo: boolean;
  safety_disclaimer: string;
}

export interface StormTrackPoint {
  timestamp: string;
  latitude: number;
  longitude: number;
  intensity_dbz: number;
  point_type: 'historical' | 'current' | 'predicted';
}

export interface StormDetail {
  id: number;
  storm_code: string;
  name: string;
  latitude: number;
  longitude: number;
  direction_deg: number;
  speed_kmh: number;
  intensity_dbz: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  status: string;
  confidence: number;
  timestamp: string;
  observed_path: StormTrackPoint[];
  current_position: StormTrackPoint;
  predicted_path: StormTrackPoint[];
}

export interface StormsData {
  total_active_storms: number;
  storms: StormDetail[];
  data_source: string;
  last_updated: string;
}

export interface AlertRule {
  id: number;
  location_name: string;
  thunderstorm_threshold: number;
  lightning_threshold: number;
  notify_method: string;
  notify_target: string;
  is_active: boolean;
  created_at: string;
}

export interface AlertItem {
  id: number;
  location_name: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  reason: string;
  timestamp: string;
  data_source: string;
  model_version: string;
  is_active: boolean;
}

export interface AlertsOverview {
  active_alerts: AlertItem[];
  alert_history: AlertItem[];
  alert_rules: AlertRule[];
  safety_notice: string;
}

export interface AIModel {
  id: number;
  name: string;
  version: string;
  task: string;
  status: 'DEMO' | 'TRAINED';
  trained_at: string;
  total_samples?: number;
  features: { name: string; importance: number }[];
  metrics: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    brier_score: number;
    pod: number;
    far: number;
    csi: number;
    confusion_matrix: {
      true_negatives: number;
      false_positives: number;
      false_negatives: number;
      true_positives: number;
    };
    roc_curve: { fpr: number; tpr: number }[];
  }>;
  safety_disclaimer: string;
}

export interface HistoricalTrend {
  date: string;
  storm_frequency: number;
  lightning_strikes: number;
  avg_rainfall_mm: number;
  high_risk_hours: number;
}

export interface HistoricalAnalytics {
  datasets: {
    id: number;
    name: string;
    row_count: number;
    date_range: string;
    uploaded_at: string;
    missing_values_count: number;
    features: string[];
    locations: string[];
  }[];
  selected_dataset?: any;
  trends: HistoricalTrend[];
  preview_rows: Record<string, any>[];
}

export interface LocationItem {
  id: number;
  name: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
}
