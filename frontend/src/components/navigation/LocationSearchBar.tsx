import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';

export const LocationSearchBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { selectedLocation, setSelectedLocation, allLocations } = useLocationContext();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = allLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      (loc.state && loc.state.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelect = (locName: string, lat: number, lon: number) => {
    setSelectedLocation(locName, lat, lon);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F0D17]/80 backdrop-blur-md border border-[#A855F7]/30 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:border-[#C084FC]/60 transition-all focus-within:border-[#C084FC] focus-within:ring-2 focus-within:ring-[#A855F7]/25">
        <MapPin className="w-4 h-4 text-[#C084FC] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Sector: ${selectedLocation}`}
          className="bg-transparent text-xs md:text-sm w-36 md:w-48 outline-none placeholder:text-[#A19DB5] text-white font-medium"
        />
        {query ? (
          <button onClick={() => setQuery('')} className="text-[#A19DB5] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Search className="w-3.5 h-3.5 text-[#A19DB5] shrink-0" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl bg-[#0F0D17]/95 backdrop-blur-xl border border-[#A855F7]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 p-2 divide-y divide-[#A855F7]/15">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-[#C084FC] uppercase tracking-wider">
            Select Observation Sector
          </div>
          <div className="pt-1 space-y-0.5">
            {filtered.length > 0 ? (
              filtered.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc.name, loc.latitude, loc.longitude)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs md:text-sm transition-all ${
                    selectedLocation === loc.name
                      ? 'bg-[#A855F7]/20 text-white font-bold border border-[#A855F7]/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'text-[#A19DB5] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C084FC]" />
                    <span>{loc.name}</span>
                  </div>
                  <span className="text-[10px] text-[#A19DB5] font-mono">{loc.state}</span>
                </button>
              ))
            ) : (
              <div className="p-3 text-xs text-[#A19DB5] text-center font-mono">No sectors matched</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
