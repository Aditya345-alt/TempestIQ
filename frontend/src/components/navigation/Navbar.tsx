import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const Navbar: React.FC = () => {

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#08070C]/85 border-b border-[#A855F7]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A855F7] via-[#C084FC] to-[#E879F9] p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.45)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all">
            <div className="w-full h-full bg-[#08070C] rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#C084FC] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl md:text-2xl font-black tracking-widest text-white group-hover:text-[#C084FC] transition-colors">
              TEMPESTIQ
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#A19DB5] uppercase -mt-0.5">
              Atmospheric Sensor Fusion
            </span>
          </div>
        </Link>

        {/* Floating Segmented Pill Navbar (RAZE signature) */}
        <nav className="hidden lg:flex items-center p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/map"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Live Map
          </NavLink>
          <NavLink
            to="/nowcast"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Nowcast
          </NavLink>
          <NavLink
            to="/radar"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Radar
          </NavLink>
          <NavLink
            to="/lightning"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Lightning
          </NavLink>
          <NavLink
            to="/presentation"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                isActive
                  ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-[#A19DB5] hover:text-white hover:bg-white/5'
              }`
            }
          >
            Presentation
          </NavLink>
        </nav>

        {/* Right Actions: RAZE Dual Pill Action Button */}
        <div className="flex items-center gap-3">

          {/* RAZE Dual Pill Action Button */}
          <Link
            to="/dashboard"
            className="group flex items-center rounded-full bg-gradient-to-r from-[#A855F7] to-[#E879F9] p-0.5 shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#08070C] group-hover:bg-transparent transition-colors">
              <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
                Live Platform
              </span>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#A855F7] to-[#E879F9] flex items-center justify-center text-white">
                <Zap className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
