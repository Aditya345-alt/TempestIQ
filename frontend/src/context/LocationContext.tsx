import React, { createContext, useContext, useState, useEffect } from 'react';
import { locationService } from '../services';
import type { LocationItem } from '../types';

interface LocationContextType {
  selectedLocation: string;
  coordinates: { lat: number; lon: number };
  setSelectedLocation: (name: string, lat?: number, lon?: number) => void;
  units: 'metric' | 'imperial';
  setUnits: (u: 'metric' | 'imperial') => void;
  allLocations: LocationItem[];
  refreshLocations: () => void;
}

const DEFAULT_COORDS: Record<string, { lat: number; lon: number }> = {
  Bhopal: { lat: 23.2599, lon: 77.4126 },
  Indore: { lat: 22.7196, lon: 75.8577 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLoc] = useState<string>('Bhopal');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>(DEFAULT_COORDS['Bhopal']);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [allLocations, setAllLocations] = useState<LocationItem[]>([]);

  const fetchLocations = async () => {
    try {
      const res = await locationService.search();
      setAllLocations(res.locations);
    } catch (err) {
      console.warn('Could not load locations list:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const setSelectedLocation = (name: string, lat?: number, lon?: number) => {
    setSelectedLoc(name);
    if (lat !== undefined && lon !== undefined) {
      setCoordinates({ lat, lon });
    } else if (DEFAULT_COORDS[name]) {
      setCoordinates(DEFAULT_COORDS[name]);
    } else {
      const found = allLocations.find((l) => l.name.toLowerCase() === name.toLowerCase());
      if (found) {
        setCoordinates({ lat: found.latitude, lon: found.longitude });
      }
    }
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        coordinates,
        setSelectedLocation,
        units,
        setUnits,
        allLocations,
        refreshLocations: fetchLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
