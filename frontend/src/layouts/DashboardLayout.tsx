import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { LocationSearchBar } from '../components/navigation/LocationSearchBar';
import { Bell, ShieldCheck, Activity, Palette, Sparkles } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { useAlerts } from '../hooks/useWeatherData';
import { useColorGrade } from '../context/ColorGradeContext';
import { ColorGradingStudio } from '../components/common/ColorGradingStudio';

export const DashboardLayout: React.FC = () => {
  const { selectedLocation } = useLocationContext();
  const { alerts } = useAlerts();
  const { config, setIsStudioOpen } = useColorGrade();
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setUtcTime(new Date().toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlertsCount = alerts?.active_alerts?.length || 0;

  const location = useLocation();
  const isMapPage = location.pathname.startsWith('/map');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08070C] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 px-6 border-b border-[#A855F7]/20 bg-[#08070C]/85 backdrop-blur-xl flex items-center justify-between shrink-0 z-30 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-4">
            <LocationSearchBar />
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#A19DB5] px-3.5 py-1.5 rounded-full bg-[#0F0D17]/80 border border-[#A855F7]/25 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse" />
              <span>STATION: {selectedLocation.toUpperCase()} RADAR-MET-01</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Color Grade Quick Switcher Pill */}
            <button
              onClick={() => setIsStudioOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-[#A855F7]/30 hover:border-[#C084FC] text-xs font-mono text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              title="Open Color Grading & Spectral LUT Studio"
            >
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
                style={{ backgroundColor: config.primary }}
              />
              <span className="hidden sm:inline text-[#A19DB5]">LUT:</span>
              <span className="font-semibold text-white">{config.name.split(' ')[0]}</span>
              <Palette className="w-3.5 h-3.5 text-[#C084FC]" />
            </button>

            {/* UTC Synoptic Time */}
            <div className="hidden sm:block text-xs font-mono text-[#A19DB5] text-right">
              <div className="text-[10px] text-[#C084FC] font-semibold tracking-wider">SYNOPTIC UTC</div>
              <div className="text-white font-medium">{utcTime || 'SYNCHRONIZING...'}</div>
            </div>

            {/* Alert Indicator */}
            <Link
              to="/alerts"
              className="relative p-2.5 rounded-full bg-[#0F0D17] border border-[#A855F7]/30 text-white hover:border-[#C084FC] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
              title={`${activeAlertsCount} Active Atmospheric Alerts`}
            >
              <Bell className="w-4 h-4 text-[#C084FC]" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[10px] font-bold flex items-center justify-center text-white animate-bounce shadow-md">
                  {activeAlertsCount}
                </span>
              )}
            </Link>

            {/* Mode Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F0D17] border border-emerald-500/40 text-xs font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="hidden md:inline font-bold">RADAR ONLINE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport with Ambient Cosmic Glow */}
        <main className={`flex-1 overflow-y-auto bg-[#08070C] relative ${
          isMapPage ? 'p-2 sm:p-3 overflow-hidden flex flex-col' : 'p-4 md:p-6 lg:p-8'
        }`}>
          <div className={`relative z-10 ${
            isMapPage ? 'w-full h-full flex-1 flex flex-col' : 'max-w-7xl mx-auto'
          }`}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Color Grading Studio Modal */}
      <ColorGradingStudio />
    </div>
  );
};
