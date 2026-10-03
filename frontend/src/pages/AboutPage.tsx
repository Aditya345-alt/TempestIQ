import React from 'react';
import {
  Info,
  ShieldAlert,
  Zap,
  Radio,
  Satellite,
  Wind,
  Cpu,
  Layers,
  Award,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="pb-4 border-b border-[#073B3C]/80">
        <span className="text-xs font-mono tracking-widest text-[#00D5E5] uppercase">
          PROJECT DOSSIER & SCIENTIFIC METHODOLOGY
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight mt-2">
          About TEMPESTIQ
        </h1>
        <p className="text-base text-[#9BAEB1] mt-2 font-sans leading-relaxed">
          AI/ML-Based Nowcasting of Thunderstorms and Lightning Using Atmospheric Observations Including Multiple Radars, Satellite, Lightning and Numerical Weather Prediction Model Data.
        </p>
      </div>

      {/* 1. The Problem & Why Nowcasting Matters */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#00D5E5] font-mono text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-[#FF4D4D]" />
          <span>01 / The Challenge & Societal Impact</span>
        </div>
        <h2 className="font-serif text-3xl text-white">Why Thunderstorm Nowcasting Matters</h2>
        <div className="p-6 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-md space-y-4 text-sm text-[#9BAEB1] leading-relaxed">
          <p>
            Severe thunderstorms, squalls, downbursts, and cloud-to-ground lightning cause thousands of fatalities and billions of dollars in agricultural and infrastructural devastation across the subcontinent every year.
          </p>
          <p>
            Traditional Numerical Weather Prediction (NWP) models (such as WRF or GFS) perform excellently over 12–72 hour horizons, but struggle during the <span className="text-white font-semibold">0 to 2 hour "nowcasting" window</span>. Convective initiation occurs rapidly over localized spatial domains (10–30 km) and unfolds within 15–45 minutes—far faster than the operational cycle of synoptic weather models.
          </p>
          <div className="p-4 rounded-xl bg-[#073B3C]/30 border border-[#087F80]/30 text-xs font-mono text-cyan-200">
            <strong>The TempestIQ Mission:</strong> Bridge the critical 0–120 minute lead-time gap by fusing real-time multi-sensor telemetry with state-of-the-art machine learning to provide actionable, localized early warnings before severe storms strike.
          </div>
        </div>
      </section>

      {/* 2. How TempestIQ Works */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#00D5E5] font-mono text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#00D5E5]" />
          <span>02 / Sensor Fusion Architecture</span>
        </div>
        <h2 className="font-serif text-3xl text-white">Multi-Source Atmospheric Ingestion</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 space-y-2">
            <div className="flex items-center gap-2 text-[#00D5E5] font-bold text-sm">
              <Radio className="w-4 h-4" />
              <span>1. Dual-Polarization Doppler Weather Radar</span>
            </div>
            <p className="text-[#9BAEB1] leading-relaxed">
              Ingests equivalent radar reflectivity (Z), radial velocity (V), and echo tops. Tracks convective storm cell centroids and identifies internal hydrometeor phases (rain, graupel, hail).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Satellite className="w-4 h-4" />
              <span>2. Geostationary Satellite Imagery (INSAT-3DR)</span>
            </div>
            <p className="text-[#9BAEB1] leading-relaxed">
              Rapid scan Thermal Infrared (10.8 µm) and Water Vapor (6.7 µm) channels. Detects cloud-top cooling rates (up to -20 K/hr) and overshooting tops before radar echoes appear at ground level.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 space-y-2">
            <div className="flex items-center gap-2 text-[#FFD166] font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>3. Ground Lightning Location Networks (LLN)</span>
            </div>
            <p className="text-[#9BAEB1] leading-relaxed">
              Detects total lightning (Intra-Cloud + Cloud-to-Ground). Rapid spikes in total flash rate ("convective jumps") provide 20–45 minute advance warning of severe surface winds and hail.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#061418] border border-[#073B3C]/80 space-y-2">
            <div className="flex items-center gap-2 text-[#FF9F43] font-bold text-sm">
              <Wind className="w-4 h-4" />
              <span>4. High-Resolution NWP Background Soundings</span>
            </div>
            <p className="text-[#9BAEB1] leading-relaxed">
              Supplies environmental thermodynamic stability indices: Convective Available Potential Energy (CAPE), Convective Inhibition (CIN), 0–6km vertical wind shear, and precipitable water.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AI/ML Architecture */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#00D5E5] font-mono text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-[#FF9F43]" />
          <span>03 / Artificial Intelligence & Modeling</span>
        </div>
        <h2 className="font-serif text-3xl text-white">AI/ML Modeling Methodology</h2>
        <div className="p-6 rounded-2xl bg-[#061418] border border-[#073B3C]/80 shadow-md space-y-4 text-sm text-[#9BAEB1] leading-relaxed">
          <p>
            TempestIQ implements a hierarchical AI pipeline comprising:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-200">
            <li>
              <strong className="text-white">Feature Engineering:</strong> Harmonizes disparate temporal and spatial resolutions across sensors into normalized grid centroids.
            </li>
            <li>
              <strong className="text-white">Extreme Gradient Boosting (XGBoost):</strong> Baseline operational classifier optimized on cross-entropy log-loss, computing probabilistic threat scores for 0–30m, 30–60m, and 60–120m horizons.
            </li>
            <li>
              <strong className="text-white">Spatiotemporal ConvLSTM / CNN-LSTM:</strong> Deep recurrent convolutional architecture designed to predict multi-step radar reflectivity grid advection.
            </li>
            <li>
              <strong className="text-white">Meteorological Verification:</strong> Verified against Critical Success Index (CSI), Probability of Detection (POD), False Alarm Ratio (FAR), and Brier Score.
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Limitations & Future Scope */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[#00D5E5] font-mono text-xs uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>04 / Limitations & Future Scope</span>
        </div>
        <h2 className="font-serif text-3xl text-white">Engineering Limitations & Roadmap</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-[#061418] border border-amber-500/40 space-y-2 text-[#9BAEB1]">
            <div className="font-bold text-amber-300 text-sm">Current Operational Limitations</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Radar beam blockage in mountainous terrain (Western Ghats / Himalayas).</li>
              <li>Temporal latency in geostationary satellite dispatches (15-min scan cycles).</li>
              <li>Sub-grid scale orographic triggers require finer micro-NWP coupling.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#061418] border border-emerald-500/40 space-y-2 text-[#9BAEB1]">
            <div className="font-bold text-emerald-300 text-sm">Future Research & Scaling Roadmap</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Integration of real-time mobile app crowd-sourced barometric pressure feeds.</li>
              <li>Physics-Informed Neural Networks (PINNs) conserving thermodynamic energy.</li>
              <li>Direct edge-deployment on Doppler radar site compute clusters.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
