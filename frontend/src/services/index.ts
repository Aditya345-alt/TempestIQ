import { fetchApi } from './api';
import type {
  CurrentWeather,
  WeatherForecast,
  NowcastData,
  RadarData,
  SatelliteData,
  LightningData,
  StormsData,
  AlertsOverview,
  AlertRule,
  AIModel,
  HistoricalAnalytics,
  LocationItem,
} from '../types';

export const weatherService = {
  getCurrent: (location = 'Bhopal') =>
    fetchApi<CurrentWeather>(`/weather/current?location=${encodeURIComponent(location)}`),
  getForecast: (location = 'Bhopal') =>
    fetchApi<WeatherForecast>(`/weather/forecast?location=${encodeURIComponent(location)}`),
};

export const nowcastService = {
  getNowcast: (location = 'Bhopal') =>
    fetchApi<NowcastData>(`/nowcast?location=${encodeURIComponent(location)}`),
  predict: (features: Record<string, any>) =>
    fetchApi<NowcastData>('/nowcast/predict', {
      method: 'POST',
      body: JSON.stringify(features),
    }),
};

export const radarService = {
  getRadar: (location = 'Bhopal') =>
    fetchApi<RadarData>(`/radar?location=${encodeURIComponent(location)}`),
};

export const satelliteService = {
  getSatellite: (location = 'Bhopal') =>
    fetchApi<SatelliteData>(`/satellite?location=${encodeURIComponent(location)}`),
};

export const lightningService = {
  getLightning: (location = 'Bhopal') =>
    fetchApi<LightningData>(`/lightning?location=${encodeURIComponent(location)}`),
};

export const stormsService = {
  getStorms: (location = 'Bhopal') =>
    fetchApi<StormsData>(`/storms?location=${encodeURIComponent(location)}`),
};

export const alertsService = {
  getAlerts: () => fetchApi<AlertsOverview>('/alerts'),
  createRule: (rule: {
    location_name: string;
    thunderstorm_threshold: number;
    lightning_threshold: number;
    notify_method: string;
    notify_target: string;
  }) =>
    fetchApi<AlertRule>('/alerts', {
      method: 'POST',
      body: JSON.stringify(rule),
    }),
  deleteRule: (id: number) =>
    fetchApi<{ status: string; message: string }>(`/alerts/${id}`, {
      method: 'DELETE',
    }),
};

export const modelsService = {
  getModels: () => fetchApi<{ models: AIModel[]; active_model_id: number }>('/models'),
  getMetrics: (id: number) => fetchApi<any>(`/models/${id}/metrics`),
};

export const historicalService = {
  getAnalytics: () => fetchApi<HistoricalAnalytics>('/historical'),
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/historical/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },
};

export const locationService = {
  search: (q = '') =>
    fetchApi<{ locations: LocationItem[] }>(`/locations/search?q=${encodeURIComponent(q)}`),
};
