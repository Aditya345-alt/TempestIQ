import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Sparkles } from 'lucide-react';

interface AtmosphericTimelinePlayerProps {
  currentOffsetMin: number;
  onOffsetChange: (offsetMin: number) => void;
  isLoading?: boolean;
}

const TIMELINE_STEPS = [
  { offset: -60, label: '-60m', type: 'HISTORICAL' },
  { offset: -45, label: '-45m', type: 'HISTORICAL' },
  { offset: -30, label: '-30m', type: 'HISTORICAL' },
  { offset: -15, label: '-15m', type: 'HISTORICAL' },
  { offset: 0, label: 'NOW', type: 'CURRENT' },
  { offset: 15, label: '+15m', type: 'PROJECTED' },
  { offset: 30, label: '+30m', type: 'PROJECTED' },
];

export const AtmosphericTimelinePlayer: React.FC<AtmosphericTimelinePlayerProps> = ({
  currentOffsetMin,
  onOffsetChange,
  isLoading = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1000); // 1 sec per frame

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        const currentIndex = TIMELINE_STEPS.findIndex((s) => s.offset === currentOffsetMin);
        const nextIndex = (currentIndex + 1) % TIMELINE_STEPS.length;
        onOffsetChange(TIMELINE_STEPS[nextIndex].offset);
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentOffsetMin, speed, onOffsetChange]);

  const currentStep = TIMELINE_STEPS.find((s) => s.offset === currentOffsetMin) || TIMELINE_STEPS[4];

  return (
    <div className="w-full bg-[#061418]/90 backdrop-blur-md border border-[#087F80]/50 rounded-xl px-4 py-2.5 shadow-2xl flex flex-col gap-2 font-mono text-xs">
      <div className="flex items-center justify-between">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-[#FF4D4D] text-white shadow-[0_0_12px_rgba(255,77,77,0.5)]'
                : 'bg-[#00D5E5] text-black hover:bg-cyan-300 shadow-[0_0_12px_rgba(0,213,229,0.3)]'
            }`}
            title={isPlaying ? 'Pause Animation' : 'Play Timeline'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onOffsetChange(0);
            }}
            className="p-1.5 rounded-lg bg-[#082226] text-[#9BAEB1] hover:text-white border border-[#087F80]/40 transition-colors"
            title="Reset to Present (NOW)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center rounded-lg bg-[#082226] border border-[#087F80]/40 p-0.5 ml-1">
            {[1000, 600, 300].map((s, idx) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  speed === s ? 'bg-[#00D5E5] text-black font-bold' : 'text-[#9BAEB1] hover:text-white'
                }`}
              >
                {idx === 0 ? '1x' : idx === 1 ? '2x' : '4x'}
              </button>
            ))}
          </div>
        </div>

        {/* Current Time Readout */}
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1.5 ${
              currentStep.type === 'CURRENT'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : currentStep.type === 'PROJECTED'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-[#082226] text-[#9BAEB1] border border-[#087F80]/40'
            }`}
          >
            {currentStep.type === 'PROJECTED' && <Sparkles className="w-3 h-3 text-purple-400" />}
            {currentStep.type === 'CURRENT' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
            {currentStep.type === 'CURRENT'
              ? 'LIVE OBSERVATION'
              : currentStep.type === 'PROJECTED'
              ? 'AI NOWCAST FORECAST'
              : 'HISTORICAL PLAYBACK'}
          </span>
          <span className="text-white font-bold text-sm">{currentStep.label}</span>
        </div>
      </div>

      {/* Scrub Bar / Timeline Steps */}
      <div className="relative flex items-center justify-between pt-1">
        {/* Track Line */}
        <div className="absolute left-2 right-2 h-1 bg-[#082226] rounded-full top-[18px]">
          <div
            className="h-full bg-gradient-to-r from-[#00D5E5] via-emerald-400 to-purple-500 rounded-full transition-all duration-300"
            style={{
              width: `${(TIMELINE_STEPS.findIndex((s) => s.offset === currentOffsetMin) / (TIMELINE_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step Nodes */}
        {TIMELINE_STEPS.map((step) => {
          const isSelected = step.offset === currentOffsetMin;
          const isProjected = step.type === 'PROJECTED';
          const isNow = step.type === 'CURRENT';

          return (
            <button
              key={step.offset}
              onClick={() => {
                setIsPlaying(false);
                onOffsetChange(step.offset);
              }}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                  isSelected
                    ? isProjected
                      ? 'bg-purple-500 border-white scale-125 shadow-[0_0_10px_#A855F7]'
                      : isNow
                      ? 'bg-[#00D5E5] border-white scale-125 shadow-[0_0_10px_#00D5E5]'
                      : 'bg-cyan-400 border-white scale-110'
                    : 'bg-[#061418] border-[#087F80] group-hover:border-[#00D5E5]'
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
              </div>
              <span
                className={`mt-1.5 text-[10px] transition-colors ${
                  isSelected
                    ? isProjected
                      ? 'text-purple-300 font-bold'
                      : 'text-[#00D5E5] font-bold'
                    : 'text-[#9BAEB1] group-hover:text-white'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
