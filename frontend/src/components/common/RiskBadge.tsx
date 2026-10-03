import React from 'react';

export const RiskBadge: React.FC<{ level: string; className?: string }> = ({ level, className = '' }) => {
  const norm = level.toUpperCase();
  let bg = 'bg-teal-950/60 border-teal-500/40 text-teal-300';
  let dot = 'bg-teal-400';

  if (norm === 'MODERATE') {
    bg = 'bg-[#FFD166]/10 border-[#FFD166]/40 text-[#FFD166]';
    dot = 'bg-[#FFD166]';
  } else if (norm === 'HIGH') {
    bg = 'bg-[#FF9F43]/10 border-[#FF9F43]/40 text-[#FF9F43]';
    dot = 'bg-[#FF9F43]';
  } else if (norm === 'SEVERE') {
    bg = 'bg-[#FF4D4D]/15 border-[#FF4D4D]/50 text-[#FF4D4D] animate-pulse';
    dot = 'bg-[#FF4D4D]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {norm}
    </span>
  );
};

export const DataSourceBadge: React.FC<{
  source: string;
  isDemo?: boolean;
  statusLabel?: string;
  lastUpdated?: string;
}> = ({ source, isDemo = true, statusLabel, lastUpdated }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#9BAEB1]">
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#073B3C]/50 border border-[#087F80]/30 text-[#00D5E5]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00D5E5] animate-ping" />
        {source}
      </span>
      {isDemo && (
        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold tracking-wider">
          {statusLabel || 'DEMO DATA'}
        </span>
      )}
      {lastUpdated && <span className="opacity-70">Updated: {lastUpdated}</span>}
    </div>
  );
};
