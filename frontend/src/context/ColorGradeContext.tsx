import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorGradePreset =
  | 'raze-violet'
  | 'cyber-aurora'
  | 'solar-flare'
  | 'monochrome-noir'
  | 'electric-cobalt';

export interface ColorGradeConfig {
  id: ColorGradePreset;
  name: string;
  subtitle: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  swatchGradient: string;
}

export const COLOR_GRADE_PRESETS: Record<ColorGradePreset, ColorGradeConfig> = {
  'raze-violet': {
    id: 'raze-violet',
    name: 'Cosmic Violet (RAZE)',
    subtitle: 'Signature Obsidian & Electric Violet Editorial',
    primary: '#A855F7',
    secondary: '#C084FC',
    accent: '#E879F9',
    background: '#08070C',
    swatchGradient: 'from-[#08070C] via-[#A855F7] to-[#E879F9]',
  },
  'cyber-aurora': {
    id: 'cyber-aurora',
    name: 'Cyber Aurora',
    subtitle: 'Northern Lights Convective Glow',
    primary: '#10B981',
    secondary: '#2DD4BF',
    accent: '#34D399',
    background: '#040C0C',
    swatchGradient: 'from-[#040C0C] via-[#10B981] to-[#2DD4BF]',
  },
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare / Thermal',
    subtitle: 'High-Energy Convective Infrared Heatmap',
    primary: '#F59E0B',
    secondary: '#FBBF24',
    accent: '#EF4444',
    background: '#0D0704',
    swatchGradient: 'from-[#0D0704] via-[#F59E0B] to-[#EF4444]',
  },
  'monochrome-noir': {
    id: 'monochrome-noir',
    name: 'Monochrome Noir',
    subtitle: 'Stark Editorial Titanium & Deep Carbon',
    primary: '#FFFFFF',
    secondary: '#E2E8F0',
    accent: '#94A3B8',
    background: '#060606',
    swatchGradient: 'from-[#060606] via-[#94A3B8] to-[#FFFFFF]',
  },
  'electric-cobalt': {
    id: 'electric-cobalt',
    name: 'Electric Cobalt',
    subtitle: 'Deep Ocean & Satellite Stratospheric Pulse',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#06B6D4',
    background: '#050813',
    swatchGradient: 'from-[#050813] via-[#3B82F6] to-[#06B6D4]',
  },
};

interface ColorGradeContextType {
  preset: ColorGradePreset;
  config: ColorGradeConfig;
  brightness: number;
  contrast: number;
  saturation: number;
  bloom: 'subtle' | 'cinematic' | 'vivid';
  vignette: boolean;
  isStudioOpen: boolean;
  setPreset: (preset: ColorGradePreset) => void;
  setBrightness: (val: number) => void;
  setContrast: (val: number) => void;
  setSaturation: (val: number) => void;
  setBloom: (val: 'subtle' | 'cinematic' | 'vivid') => void;
  setVignette: (val: boolean) => void;
  setIsStudioOpen: (open: boolean) => void;
  resetDefaults: () => void;
}

const ColorGradeContext = createContext<ColorGradeContextType | undefined>(undefined);

const STORAGE_KEY = 'tempestiq_color_grade_settings';

export const ColorGradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPresetState] = useState<ColorGradePreset>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (COLOR_GRADE_PRESETS[parsed.preset as ColorGradePreset]) {
          return parsed.preset;
        }
      }
    } catch {
      // ignore
    }
    return 'raze-violet';
  });

  const [brightness, setBrightnessState] = useState<number>(100);
  const [contrast, setContrastState] = useState<number>(105);
  const [saturation, setSaturationState] = useState<number>(110);
  const [bloom, setBloomState] = useState<'subtle' | 'cinematic' | 'vivid'>('cinematic');
  const [vignette, setVignetteState] = useState<boolean>(true);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  // Apply to document root whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color-grade', preset);
    root.style.setProperty('--grade-brightness', `${brightness}%`);
    root.style.setProperty('--grade-contrast', `${contrast}%`);
    root.style.setProperty('--grade-saturate', `${saturation}%`);

    if (vignette) {
      document.body.classList.add('raze-vignette-active');
    } else {
      document.body.classList.remove('raze-vignette-active');
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preset,
          brightness,
          contrast,
          saturation,
          bloom,
          vignette,
        })
      );
    } catch {
      // ignore
    }
  }, [preset, brightness, contrast, saturation, bloom, vignette]);

  const setPreset = (p: ColorGradePreset) => setPresetState(p);
  const setBrightness = (b: number) => setBrightnessState(b);
  const setContrast = (c: number) => setContrastState(c);
  const setSaturation = (s: number) => setSaturationState(s);
  const setBloom = (bl: 'subtle' | 'cinematic' | 'vivid') => setBloomState(bl);
  const setVignette = (v: boolean) => setVignetteState(v);

  const resetDefaults = () => {
    setPresetState('raze-violet');
    setBrightnessState(100);
    setContrastState(105);
    setSaturationState(110);
    setBloomState('cinematic');
    setVignetteState(true);
  };

  const config = COLOR_GRADE_PRESETS[preset] || COLOR_GRADE_PRESETS['raze-violet'];

  return (
    <ColorGradeContext.Provider
      value={{
        preset,
        config,
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
      }}
    >
      {children}
    </ColorGradeContext.Provider>
  );
};

export const useColorGrade = (): ColorGradeContextType => {
  const ctx = useContext(ColorGradeContext);
  if (!ctx) {
    throw new Error('useColorGrade must be used within a ColorGradeProvider');
  }
  return ctx;
};
