import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  Map as MapIcon,
  Zap,
  Radio,
  Satellite,
  CloudLightning,
  Wind,
  Calendar,
  Bell,
  Database,
  Cpu,
  Settings as SettingsIcon,
  Info,
  Presentation,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: Activity },
  { path: '/map', label: 'Live Map', icon: MapIcon },
  { path: '/nowcast', label: 'Nowcasting', icon: Zap },
  { path: '/radar', label: 'Radar', icon: Radio },
  { path: '/satellite', label: 'Satellite', icon: Satellite },
  { path: '/lightning', label: 'Lightning', icon: CloudLightning },
  { path: '/storms', label: 'Storm Tracking', icon: Wind },
  { path: '/forecast', label: 'Forecast', icon: Calendar },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/historical', label: 'Historical Data', icon: Database },
  { path: '/models', label: 'AI Models', icon: Cpu },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
  { path: '/about', label: 'About', icon: Info },
  { path: '/presentation', label: 'Presentation Mode', icon: Presentation },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative z-40 flex flex-col h-screen transition-all duration-300 bg-[#0B0912] border-r border-[#A855F7]/20 shadow-[4px_0_25px_rgba(0,0,0,0.6)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#A855F7]/20">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A855F7] via-[#C084FC] to-[#E879F9] flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#08070C] rounded-[14px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#C084FC]" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg tracking-wider text-white font-black group-hover:text-[#C084FC] transition-colors">
                TEMPESTIQ
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#A19DB5] uppercase font-medium">
                Atmospheric AI
              </span>
            </div>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl text-[#A19DB5] hover:text-white hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#A855F7]/25 to-[#E879F9]/15 text-white font-bold border border-[#A855F7]/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'text-[#A19DB5] hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-[#C084FC]" />
              {!collapsed && <span className="font-sans">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Safety Footer Badge */}
      <div className="p-4 border-t border-[#A855F7]/20">
        {!collapsed ? (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-[#A855F7]/25 text-[11px] text-[#A19DB5] leading-relaxed">
            <div className="flex items-center gap-1.5 text-white text-[10px] font-mono uppercase font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-[#E879F9]" />
              PHYSICS-INFORMED ML
            </div>
            Multi-radar Doppler & satellite convective nowcasting engine.
          </div>
        ) : (
          <div className="flex justify-center text-[#E879F9]" title="Physics-Informed Atmospheric Intelligence">
            <ShieldAlert className="w-5 h-5" />
          </div>
        )}
      </div>
    </aside>
  );
};
