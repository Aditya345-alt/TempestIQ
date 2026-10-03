import { useState, useEffect, useCallback } from 'react';
import {
  weatherService,
  nowcastService,
  radarService,
  satelliteService,
  lightningService,
  stormsService,
  alertsService,
  modelsService,
  historicalService,
} from '../services';
import type {
  CurrentWeather,
  WeatherForecast,
  NowcastData,
  RadarData,
  SatelliteData,
  LightningData,
  StormsData,
  AlertsOverview,
  AIModel,
  HistoricalAnalytics,
} from '../types';

export function useWeather(location: string) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [curr, fc] = await Promise.all([
        weatherService.getCurrent(location),
        weatherService.getForecast(location),
      ]);
      setCurrent(curr);
      setForecast(fc);
    } catch (err: any) {
      setError(err.message || 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { current, forecast, loading, error, refetch: fetchWeather };
}

export function useNowcast(location: string) {
  const [nowcast, setNowcast] = useState<NowcastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowcast = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await nowcastService.getNowcast(location);
      setNowcast(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load nowcasting data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchNowcast();
  }, [fetchNowcast]);

  return { nowcast, loading, error, refetch: fetchNowcast };
}

export function useRadar(location: string) {
  const [radar, setRadar] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRadar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await radarService.getRadar(location);
      setRadar(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load radar data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchRadar();
  }, [fetchRadar]);

  return { radar, loading, error, refetch: fetchRadar };
}

export function useSatellite(location: string) {
  const [satellite, setSatellite] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSatellite = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await satelliteService.getSatellite(location);
      setSatellite(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load satellite data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchSatellite();
  }, [fetchSatellite]);

  return { satellite, loading, error, refetch: fetchSatellite };
}

export function useLightning(location: string) {
  const [lightning, setLightning] = useState<LightningData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLightning = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await lightningService.getLightning(location);
      setLightning(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load lightning data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchLightning();
  }, [fetchLightning]);

  return { lightning, loading, error, refetch: fetchLightning };
}

export function useStorms(location: string) {
  const [storms, setStorms] = useState<StormsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStorms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await stormsService.getStorms(location);
      setStorms(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load storm tracking data');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchStorms();
  }, [fetchStorms]);

  return { storms, loading, error, refetch: fetchStorms };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertsService.getAlerts();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
}

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await modelsService.getModels();
      setModels(res.models);
    } catch (err: any) {
      setError(err.message || 'Failed to load models');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, loading, error, refetch: fetchModels };
}

export function useHistorical() {
  const [data, setData] = useState<HistoricalAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorical = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await historicalService.getAnalytics();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load historical analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorical();
  }, [fetchHistorical]);

  return { data, loading, error, refetch: fetchHistorical };
}
