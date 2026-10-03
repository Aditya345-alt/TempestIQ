import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { ColorGradeProvider } from './context/ColorGradeContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { NowcastingPage } from './pages/NowcastingPage';
import { RadarPage } from './pages/RadarPage';
import { SatellitePage } from './pages/SatellitePage';
import { LightningPage } from './pages/LightningPage';
import { StormTrackingPage } from './pages/StormTrackingPage';
import { ForecastPage } from './pages/ForecastPage';
import { AlertsPage } from './pages/AlertsPage';
import { HistoricalPage } from './pages/HistoricalPage';
import { AIModelsPage } from './pages/AIModelsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { PresentationPage } from './pages/PresentationPage';

export function App() {
  return (
    <ColorGradeProvider>
      <LocationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Dedicated Hackathon / Pitch Presentation Mode */}
            <Route path="/presentation" element={<PresentationPage />} />

            {/* Operational Meteorological Dashboard */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<OverviewPage />} />
              <Route path="/map" element={<LiveMapPage />} />
              <Route path="/nowcast" element={<NowcastingPage />} />
              <Route path="/radar" element={<RadarPage />} />
              <Route path="/satellite" element={<SatellitePage />} />
              <Route path="/lightning" element={<LightningPage />} />
              <Route path="/storms" element={<StormTrackingPage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/historical" element={<HistoricalPage />} />
              <Route path="/models" element={<AIModelsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LocationProvider>
    </ColorGradeProvider>
  );
}

export default App;
