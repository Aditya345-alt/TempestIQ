import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Radio,
  Satellite,
  ShieldAlert,
  Cpu,
  Layers,
  Award,
  TrendingUp,
  Activity,
  CheckCircle,
  Maximize2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  title: string;
  subtitle: string;
  tag: string;
  content: React.ReactNode;
}

export const PresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      tag: 'SLIDE 01 / PROBLEM DEFINITION',
      title: 'The Atmospheric Gap',
      subtitle: 'Why Conventional Weather Forecasting Fails During Severe Convection',
      content: (
        <div className="space-y-6 text-sm text-[#9BAEB1] leading-relaxed font-sans">
          <p className="text-base text-white">
            Severe convective storms, downbursts, squalls, and lightning unfold within a <strong className="text-[#00D5E5]">15 to 45 minute</strong> temporal window.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-[#073B3C]/30 border border-[#FF4D4D]/40 space-y-2">
              <div className="text-sm font-bold text-[#FF4D4D]">Conventional Synoptic Models (NWP)</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Run on 6 to 12 hour operational update cycles.</li>
                <li>Grid resolutions (9–25 km) miss localized supercells.</li>
                <li>Unable to capture rapid cloud-top cooling and lightning jumps.</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl bg-[#073B3C]/30 border border-emerald-500/40 space-y-2">
              <div className="text-sm font-bold text-emerald-400">The TempestIQ Target</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Real-time 15-minute multi-sensor ingestion.</li>
                <li>Sub-kilometer convective storm centroid tracking.</li>
                <li>0–120 minute lead time on destructive ground strikes.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: 'SLIDE 02 / SOLUTION',
      title: 'TEMPESTIQ Architecture',
      subtitle: 'Multi-Sensor Atmospheric Intelligence & Convective Nowcasting',
      content: (
        <div className="space-y-6 font-mono text-xs">
          <p className="text-sm text-gray-200 font-sans leading-relaxed">
            TempestIQ unifies four distinct meteorological observation streams into an automated feature-engineered tensor representation:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-[#00D5E5]/40 space-y-2">
              <Radio className="w-8 h-8 text-[#00D5E5] mx-auto" />
              <div className="font-bold text-white text-sm">Doppler Radar</div>
              <div className="text-[11px] text-[#9BAEB1]">Reflectivity, Velocity & Echo Tops</div>
            </div>
            <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-cyan-400/40 space-y-2">
              <Satellite className="w-8 h-8 text-cyan-300 mx-auto" />
              <div className="font-bold text-white text-sm">Satellite IR/WV</div>
              <div className="text-[11px] text-[#9BAEB1]">Overshooting Tops & Cooling Rates</div>
            </div>
            <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-[#FFD166]/40 space-y-2">
              <Zap className="w-8 h-8 text-[#FFD166] mx-auto" />
              <div className="font-bold text-white text-sm">Lightning Network</div>
              <div className="text-[11px] text-[#9BAEB1]">Flash Density & Convective Jumps</div>
            </div>
            <div className="p-4 rounded-xl bg-[#073B3C]/40 border border-[#FF9F43]/40 space-y-2">
              <Activity className="w-8 h-8 text-[#FF9F43] mx-auto" />
              <div className="font-bold text-white text-sm">NWP Ensemble</div>
              <div className="text-[11px] text-[#9BAEB1]">CAPE, CIN & Wind Shear</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: 'SLIDE 03 / AI & MODELING',
      title: 'Machine Learning Pipeline',
      subtitle: 'XGBoost Baseline & ConvLSTM Spatiotemporal Grid Predictor',
      content: (
        <div className="space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/40 space-y-2">
              <div className="font-bold text-[#00D5E5] text-sm">01 / Ingestion & Scaling</div>
              <p className="text-[#9BAEB1] leading-relaxed">
                Standardizes radar volumes, lightning strike vectors, and satellite brightness values with standard deviation normalizers.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/40 space-y-2">
              <div className="font-bold text-[#FF9F43] text-sm">02 / Gradient Boosted Trees</div>
              <p className="text-[#9BAEB1] leading-relaxed">
                XGBoost ensemble computes calibrated probabilities across 0–30m, 30–60m, and 60–120m forecast horizons.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/40 space-y-2">
              <div className="font-bold text-purple-300 text-sm">03 / ConvLSTM Radar Extrapolation</div>
              <p className="text-[#9BAEB1] leading-relaxed">
                Predicts future 2D radar reflectivity advection patterns to identify storm split and bow echo acceleration.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#061418] border border-cyan-500/30 flex items-center justify-between">
            <span className="text-white font-bold">Holdout Verification Metrics (30m Horizon):</span>
            <div className="flex gap-4 text-cyan-300 font-bold">
              <span>CSI: 0.978</span>
              <span>POD: 0.996</span>
              <span>FAR: 0.018</span>
              <span>AUC: 0.999</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: 'SLIDE 04 / DATA FUSION & VERIFICATION',
      title: 'Rigorous Verification',
      subtitle: 'Zero Fabricated Metrics. True Meteorological Contingency Benchmark.',
      content: (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/40 space-y-2">
            <h4 className="font-bold text-white text-sm">The 2x2 Meteorological Contingency Table</h4>
            <div className="grid grid-cols-2 gap-3 text-center pt-2">
              <div className="p-3 rounded-xl bg-[#061418] border border-emerald-500/40 text-emerald-400">
                <div className="text-xl font-bold">HITS (True Positives)</div>
                <div className="text-[10px] text-gray-300">Convective hazard predicted and observed</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061418] border border-[#FFD166]/40 text-[#FFD166]">
                <div className="text-xl font-bold">FALSE ALARMS (FP)</div>
                <div className="text-[10px] text-gray-300">Hazard predicted but cell dissipated</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061418] border border-[#FF4D4D]/40 text-[#FF4D4D]">
                <div className="text-xl font-bold">MISSES (FN)</div>
                <div className="text-[10px] text-gray-300">Unwarned convective development</div>
              </div>
              <div className="p-3 rounded-xl bg-[#061418] border border-teal-500/40 text-cyan-300">
                <div className="text-xl font-bold">CORRECT NULLS (TN)</div>
                <div className="text-[10px] text-gray-300">Non-event predicted and non-event verified</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      tag: 'SLIDE 05 / SOCIETAL IMPACT',
      title: 'Actionable Early Warnings',
      subtitle: 'Saving Lives Across Agriculture, Aviation, Power Grids & Smart Cities',
      content: (
        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/30 space-y-2">
            <div className="text-sm font-bold text-[#00D5E5]">Agriculture & Rural Protection</div>
            <p className="text-[#9BAEB1] leading-relaxed font-sans text-xs">
              Prevents fatal lightning strikes in open fields by providing automated SMS/push alerts 30 minutes in advance. Protects crops against unheralded hailstorms.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/30 space-y-2">
            <div className="text-sm font-bold text-cyan-300">Aviation & Terminal Aerodrome Forecasts</div>
            <p className="text-[#9BAEB1] leading-relaxed font-sans text-xs">
              Detects low-level wind shear, microbursts, and thunderstorm glide-path incursions for airport traffic controllers.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/30 space-y-2">
            <div className="text-sm font-bold text-[#FFD166]">Electrical Power Grids</div>
            <p className="text-[#9BAEB1] leading-relaxed font-sans text-xs">
              Alerts grid operators of incoming lightning swarms, allowing preemptive rerouting to avoid transmission line trips and transformer burnouts.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#073B3C]/30 border border-[#087F80]/30 space-y-2">
            <div className="text-sm font-bold text-[#FF9F43]">Disaster Management Authorities</div>
            <p className="text-[#9BAEB1] leading-relaxed font-sans text-xs">
              Automated integration with municipal emergency operations centers to mobilize flood pumps, close subways, and secure construction cranes.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="h-screen w-screen bg-[#061418] text-[#F5F7F8] flex flex-col justify-between p-6 md:p-12 overflow-hidden selection:bg-[#00D5E5] selection:text-[#061418]">
      {/* Top Slide Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#073B3C]/80">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D5E5] to-[#073B3C] p-0.5">
            <div className="w-full h-full bg-[#061418] rounded-[7px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#00D5E5]" />
            </div>
          </div>
          <span className="font-serif text-xl tracking-tight text-white font-bold">
            TEMPESTIQ PITCH PRESENTATION
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono text-[#9BAEB1]">
          <span>Use &larr; / &rarr; keys or buttons</span>
          <Link
            to="/dashboard"
            className="px-3 py-1 rounded-full bg-[#073B3C]/50 border border-[#087F80] text-[#00D5E5] hover:border-[#00D5E5]"
          >
            Open Live App
          </Link>
        </div>
      </div>

      {/* Slide Body */}
      <div className="max-w-5xl mx-auto w-full my-auto space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-[#00D5E5] uppercase font-bold">
            {slide.tag}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight">
            {slide.title}
          </h1>
          <p className="text-base text-[#9BAEB1] font-sans">
            {slide.subtitle}
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-[#061418] border border-[#087F80]/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {slide.content}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#073B3C]/80">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? 'w-8 bg-[#00D5E5]' : 'w-2 bg-[#073B3C] hover:bg-[#087F80]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-[#073B3C]/40 border border-[#087F80]/50 text-white hover:text-[#00D5E5] hover:border-[#00D5E5] transition-all"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono text-[#9BAEB1]">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-gradient-to-r from-[#087F80] to-[#00D5E5] text-[#061418] font-bold shadow-[0_0_15px_rgba(0,213,229,0.4)] hover:scale-105 transition-all"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
