import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building2, Radio, X, Loader2 } from 'lucide-react';
import { indiaMapService } from '../../services/indiaMapService';
import type { LocationSearchResult } from '../../types/indiaMap';

interface LocationSearchBarProps {
  onSelectLocation: (result: LocationSearchResult) => void;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({ onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await indiaMapService.searchLocations(query.trim());
          setResults(res);
          setIsOpen(true);
        } catch (err) {
          console.error('Location search failed:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (r: LocationSearchResult) => {
    setQuery(r.name);
    setIsOpen(false);
    onSelectLocation(r);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md font-mono text-xs z-[1100]">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-[#00D5E5]">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search Indian city, district, state, or radar..."
          className="w-full pl-9 pr-8 py-2 bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/60 rounded-xl text-white placeholder-[#9BAEB1]/60 focus:outline-none focus:border-[#00D5E5] focus:ring-1 focus:ring-[#00D5E5] shadow-xl"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-2.5 text-[#9BAEB1] hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 max-h-72 overflow-y-auto bg-[#061418]/95 backdrop-blur-xl border border-[#087F80]/60 rounded-xl shadow-2xl p-1 divide-y divide-[#073B3C]/50">
          {results.map((r, idx) => (
            <button
              key={`${r.type}-${r.name}-${idx}`}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2 hover:bg-[#082226] rounded-lg transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded bg-[#073B3C]/50 text-[#00D5E5] group-hover:bg-[#00D5E5]/20">
                  {r.type === 'CITY' && <MapPin className="w-3.5 h-3.5" />}
                  {r.type === 'DISTRICT' && <Building2 className="w-3.5 h-3.5" />}
                  {r.type === 'STATE' && <Radio className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="text-white font-semibold text-xs group-hover:text-[#00D5E5] transition-colors">
                    {r.name}
                  </div>
                  <div className="text-[10px] text-[#9BAEB1]">
                    {r.district ? `${r.district}, ` : ''}{r.state}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#082226] text-[#00D5E5] border border-[#087F80]/40">
                  {r.type}
                </span>
                {r.risk_level && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      r.risk_level === 'SEVERE' || r.risk_level === 'EXTREME'
                        ? 'bg-red-500/20 text-red-400'
                        : r.risk_level === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {r.risk_level}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
