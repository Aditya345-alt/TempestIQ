import React from 'react';
import {
  Sliders,
  Palette,
  Sparkles,
  Eye,
  RotateCcw,
  X,
  Check,
  Sun,
  Contrast,
  Aperture,
  Film,
} from 'lucide-react';
import {
  useColorGrade,
  COLOR_GRADE_PRESETS,
  ColorGradePreset,
} from '../../context/ColorGradeContext';

export const ColorGradingStudio: React.FC = () => {
  const {
    preset,
    brightness,
    contrast,
    saturation,
    bloom,
    vignette,
    isStudioOpen,
    setPreset,
    setBrightness,
    setContrast,
    setSaturation,
    setBloom,
    setVignette,
    setIsStudioOpen,
    resetDefaults,
  } = useColorGrade();

  if (!isStudioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F0D17]/95 border border-[#A855F7]/30 shadow-[0_0_60px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#A855F7]/20 flex items-center justify-between bg-gradient-to-r from-[#161324] to-[#0F0D17]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#E879F9] p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full bg-[#08070C] rounded-[14px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#C084FC]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white tracking-wide">
                  Color Grading & LUT Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/40">
                  REAL-TIME LUT
                </span>
              </div>
              <p className="text-xs text-[#A19DB5] font-sans mt-0.5">
                Perceptual color calibration for atmospheric radar, storm telemetry & UI.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStudioOpen(false)}
            className="p-2 rounded-full text-[#A19DB5] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Presets Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#C084FC] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Select Atmospheric Color Grade
              </span>
              <span className="text-[11px] font-mono text-[#A19DB5]">
                Active: {COLOR_GRADE_PRESETS[preset]?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(COLOR_GRADE_PRESETS) as ColorGradePreset[]).map((key) => {
                const item = COLOR_GRADE_PRESETS[key];
                const isSelected = preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => setPreset(key)}
                    className={`relative p-3.5 rounded-2xl text-left transition-all duration-200 border ${
                      isSelected
                        ? 'bg-[#1C1630] border-[#C084FC] shadow-[0_0_25px_rgba(168,85,247,0.3)] ring-1 ring-[#C084FC]'
                        : 'bg-[#12101D] border-white/10 hover:border-white/20 hover:bg-[#161324]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.primary }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.secondary }}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.accent }}
                        />
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#A855F7] flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="font-display font-bold text-white text-sm tracking-wide">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#A19DB5] mt-1 leading-snug line-clamp-1">
                      {item.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Fine-Tuning Calibration Sliders */}
          <div className="p-4 rounded-2xl bg-[#12101D] border border-white/10 space-y-4">
            <span className="text-xs font-mono font-bold tracking-wider text-[#C084FC] uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Perceptual Tuning (Dynamic Filter Pipe)
            </span>

            {/* Brightness / Exposure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A19DB5] flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#C084FC]" />
                  Exposure / Brightness
                </span>
                <span className="text-white font-bold">{brightness}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="125"
                step="1"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10 accent-[#A855F7]"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A19DB5] flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-[#C084FC]" />
                  Tone Contrast
                </span>
                <span className="text-white font-bold">{contrast}%</span>
              </div>
              <input
                type="range"
                min="90"
                max="135"
                step="1"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10 accent-[#A855F7]"
              />
            </div>

            {/* Saturation Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#A19DB5] flex items-center gap-1.5">
                  <Aperture className="w-3.5 h-3.5 text-[#C084FC]" />
                  Chroma Saturation
                </span>
                <span className="text-white font-bold">{saturation}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="150"
                step="1"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10 accent-[#A855F7]"
              />
            </div>
          </div>

          {/* Section 3: Ambient Bloom & Vignette */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ambient Bloom Level */}
            <div className="p-4 rounded-2xl bg-[#12101D] border border-white/10 space-y-2">
              <div className="text-xs font-mono text-[#A19DB5] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                Cosmic Ambient Bloom
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['subtle', 'cinematic', 'vivid'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBloom(b)}
                    className={`py-1.5 rounded-xl text-xs font-mono font-medium capitalize transition-all ${
                      bloom === b
                        ? 'bg-[#A855F7] text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                        : 'bg-white/5 text-[#A19DB5] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Cinematic Vignette */}
            <div className="p-4 rounded-2xl bg-[#12101D] border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-white font-medium flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#C084FC]" />
                  Cinematic Vignette
                </div>
                <div className="text-[11px] text-[#A19DB5] mt-0.5">
                  Lens shading for focused telemetry
                </div>
              </div>
              <button
                onClick={() => setVignette(!vignette)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                  vignette ? 'bg-[#A855F7]' : 'bg-white/20'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    vignette ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#A855F7]/20 bg-[#161324] flex items-center justify-between">
          <button
            onClick={resetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#A19DB5] hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to RAZE Defaults
          </button>
          <button
            onClick={() => setIsStudioOpen(false)}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white text-xs font-display font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] transition-all"
          >
            Done Grading
          </button>
        </div>
      </div>
    </div>
  );
};
