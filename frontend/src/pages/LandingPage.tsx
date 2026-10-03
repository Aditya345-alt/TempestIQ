import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Radio,
  Satellite,
  CloudLightning,
  Wind,
  Shield,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle,
  Cpu,
  Layers,
  Activity,
  Sparkles,
  ChevronDown,
  Palette,
} from 'lucide-react';
import Globe from '../components/originkit/ui/hero-17/globe';
import ParticleDrift from '../components/originkit/ui/particle-drift';
import { Navbar } from '../components/navigation/Navbar';
import { useColorGrade } from '../context/ColorGradeContext';
import { ColorGradingStudio } from '../components/common/ColorGradingStudio';

export const LandingPage: React.FC = () => {
  const { config, setIsStudioOpen } = useColorGrade();

  const globeDots = React.useMemo(
    () => ({
      color: config.secondary || config.primary || '#C084FC',
      size: 5,
      density: 7,
      allDots: false,
    }),
    [config.secondary, config.primary]
  );

  return (
    <div className="min-h-screen bg-[#08070C] text-[#FFFFFF] overflow-x-hidden relative selection:bg-[#A855F7] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* ==================================================
          SECTION 1: HERO - RAZE EDITORIAL AESTHETIC
          ================================================== */}
      <section className="relative isolate flex min-h-[96vh] w-full flex-col justify-between overflow-hidden px-4 py-8 md:px-8 lg:px-12">
        {/* Subtle Vertical Dashed Guidelines spanning the layout (as seen in RAZE) */}
        <div className="raze-grid-guides opacity-25" />

        {/* Ambient Cosmic Purple Glow & Nebula Layers */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] rounded-full blur-[130px] opacity-40 transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${config.primary} 0%, ${config.accent} 50%, transparent 80%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 20%, ${config.primary}25 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Hero Top Row: Left Narrative Quote + Right Station Status */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pt-4 flex items-center justify-between">
          <div className="flex items-start max-w-sm">
            <span className="raze-drop-cap text-3xl md:text-4xl">W</span>
            <p className="text-xs md:text-sm font-sans text-[#A19DB5] leading-relaxed pt-0.5">
              here atmospheric science meets deep intelligence and prediction knows no bounds!
            </p>
          </div>
        </div>

        {/* Center: Hero Title 'TEMPEST' + Floating Glowing Badge */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center my-8">
          <motion.h1
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.22em] text-white raze-glow-text uppercase select-none leading-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            TEMPEST
          </motion.h1>

          {/* Circular Glowing Floating Badge (Inspired by central 'Sing Up' badge in RAZE) */}
          <motion.div
            className="my-5 relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div
              className="absolute -inset-4 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
              style={{ background: config.primary }}
            />
            <Link
              to="/dashboard"
              className="relative size-24 md:size-28 rounded-full bg-[#08070C]/90 border border-[#A855F7]/60 flex flex-col items-center justify-center text-center shadow-[0_0_35px_rgba(168,85,247,0.5)] backdrop-blur-xl group-hover:border-[#C084FC] transition-colors"
            >
              <span className="font-display text-xs md:text-sm font-extrabold text-white tracking-widest leading-none">
                LAUNCH
              </span>
              <span className="font-display text-xs md:text-sm font-extrabold text-[#C084FC] tracking-widest leading-none mt-1">
                NOWCAST
              </span>
              <Zap className="w-3.5 h-3.5 text-[#E879F9] mt-1 group-hover:rotate-12 transition-transform" />
            </Link>
          </motion.div>

          <p className="text-[11px] font-mono tracking-[0.3em] text-[#A19DB5] uppercase">
            AUTONOMOUS CONVECTIVE SENSOR FUSION ENGINE
          </p>

          {/* 3D Interactive Convective Globe */}
          <div className="relative size-[260px] sm:size-[320px] md:size-[380px] rounded-full overflow-hidden shadow-[0_0_80px_rgba(168,85,247,0.25)] border border-[#A855F7]/25 mt-6">
            <Globe
              direction="right"
              speed={1.4}
              smoothing={8}
              stopOnHover={true}
              fill="dots"
              dots={globeDots}
              oceanColor="#08070C"
              outlineColor="#ffffff40"
              graticuleColor="#a855f740"
              showOutline={true}
              showGrid={true}
              scale={10}
              detail={5}
              initialLatitude={23}
              initialLongitude={77}
            />
          </div>
        </div>

        {/* Hero Bottom: Scroll to explore & Section Lead */}
        <div className="relative z-10 w-full max-w-7xl mx-auto pb-4 flex items-center justify-between border-t border-[#A855F7]/15 pt-4 text-xs font-mono text-[#A19DB5]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OPERATIONAL HORIZON: 0–120 MIN</span>
          </div>

          <a
            href="#who-we-are"
            className="flex items-center gap-1.5 text-[#C084FC] hover:text-white transition-colors"
          >
            <span>Scroll to Explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ==================================================
          SECTION 2: EDITORIAL STATEMENTS (RAZE Layout)
          ================================================== */}
      <section id="who-we-are" className="relative py-24 px-4 md:px-8 lg:px-12 border-t border-[#A855F7]/20 bg-[#08070C]">
        <div className="raze-grid-guides opacity-25" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Three-Column Editorial Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 border-b border-[#A855F7]/15">
            {/* Column 1: Who We Are? */}
            <div className="lg:col-span-4">
              <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">
                Who We<br />Are?
              </h2>
            </div>

            {/* Column 2: Drop-cap Editorial Statement */}
            <div className="lg:col-span-5">
              <div className="flex items-start">
                <span className="raze-drop-cap text-4xl md:text-5xl">W</span>
                <p className="text-sm md:text-base text-[#A19DB5] leading-relaxed pt-1 font-sans">
                  e redefine the standards of severe storm nowcasting by embracing multi-sensor telemetry, celebrating physical boundary layer dynamics, and nurturing deep neural extrapolation.
                </p>
              </div>
            </div>

            {/* Column 3: Action & Membership */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-display text-xl font-bold text-white tracking-tight">
                Be a Part Of Something Great
              </h3>
              <div className="flex items-center gap-2">
                <Link
                  to="/nowcast"
                  className="px-5 py-2 rounded-full bg-white/[0.05] border border-white/20 text-xs font-mono text-white hover:border-[#C084FC] transition-colors"
                >
                  Explore Nowcast
                </Link>
                <div className="p-2 rounded-full bg-white/10 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 01: Card Showcase (Inspired by RAZE "WE'RE NOT JUST A MODELING AGENCY") */}
          <div className="pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Section 01 Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  WE'RE NOT JUST A<br />NOWCASTING ENGINE
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-[#A855F7] to-[#E879F9] rounded-full" />
              </div>

              <p className="text-sm md:text-base text-[#A19DB5] leading-relaxed font-sans max-w-lg">
                We're a dynamic atmospheric intelligence platform that breathes life into raw Doppler reflectivity, INSAT-3DR satellite radiance, and lightning strikes. Whether you're safeguarding an international airport or managing urban infrastructure, we provide an unyielding radar horizon.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <span className="font-display text-4xl md:text-5xl font-black text-white/30 tracking-tight">
                  01
                </span>
                <div className="text-xs font-mono text-[#A19DB5]">
                  <span>RAPID SCAN RADIAL VELOCITY EXTRAPOLATION</span>
                  <div className="text-[#C084FC] font-semibold">15-Minute Convective Cycle Refresh</div>
                </div>
              </div>
            </div>

            {/* Right: Interactive High-Tech Convective Telemetry Card */}
            <div className="lg:col-span-6">
              <div className="raze-card p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#A855F7]/20 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-ping" />
                    <span className="font-display text-sm font-bold text-white tracking-wider">
                      CONVECTIVE CORE: STM-882
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
                    SUPERCELL CLUSTER
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-[#A19DB5]">Peak Reflectivity</div>
                    <div className="text-lg font-bold text-white mt-0.5">58.4 dBZ</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-[#A19DB5]">Storm Motion</div>
                    <div className="text-lg font-bold text-[#C084FC] mt-0.5">36.5 km/h</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] text-[#A19DB5]">Flash Frequency</div>
                    <div className="text-lg font-bold text-[#E879F9] mt-0.5">42 strikes</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#08070C]/80 border border-[#A855F7]/25 text-xs font-mono space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Forecast Intercept:</span>
                    <span className="text-[#C084FC] font-semibold">Vidisha Sector in 24 min</span>
                  </div>
                  <div className="flex justify-between text-[#A19DB5]">
                    <span>Echo Top Elevation:</span>
                    <span>14.2 km (Overshooting Convective Anvil)</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/storms"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C084FC] hover:text-white transition-colors"
                  >
                    <span>Inspect Cell Trajectory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 3: MULTI-SOURCE ATMOSPHERIC INTELLIGENCE (Particle Drift)
          ================================================== */}
      <section className="relative overflow-hidden border-t border-[#A855F7]/20 bg-[#08070C]">
        {/* Originkit Particle Drift Atmospheric Background tuned to RAZE Palette */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-auto">
          <ParticleDrift
            background="#08070C"
            baseColor="#E2DDF0"
            accentColor={config.primary}
            density={130}
            dotSize={4}
            speed={26}
            direction={55}
            hover={180}
            linkDistance={150}
            linkThickness={1.4}
            style={{ width: '100%', height: '100%', minWidth: 0, minHeight: 0 }}
          />
        </div>

        <div className="raze-grid-guides opacity-20" />

        <div className="relative z-10 py-24 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono tracking-widest text-[#C084FC] uppercase">
                SECTION 02 / REAL-TIME RADAR EXTENSION
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Track the Storm.
                <span className="block text-[#A19DB5] text-2xl md:text-3xl font-normal mt-2">
                  Multi-source atmospheric intelligence.
                </span>
              </h2>
              <p className="text-[#A19DB5] leading-relaxed text-sm md:text-base font-sans">
                A single sensor is never enough. TempestIQ fuses multi-station Doppler radars, geostationary satellites, lightning location networks, and high-resolution numerical weather models to track convective storm cells in real time.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="raze-card p-4">
                  <Radio className="w-5 h-5 text-[#C084FC] mb-2" />
                  <h4 className="font-display font-bold text-white text-sm">Doppler Radar</h4>
                  <p className="text-xs text-[#A19DB5] mt-1">Reflectivity, radial velocity & echo top structure</p>
                </div>
                <div className="raze-card p-4">
                  <Satellite className="w-5 h-5 text-cyan-300 mb-2" />
                  <h4 className="font-display font-bold text-white text-sm">Satellite IR & WV</h4>
                  <p className="text-xs text-[#A19DB5] mt-1">Cloud-top cooling rates & overshooting tops</p>
                </div>
                <div className="raze-card p-4">
                  <CloudLightning className="w-5 h-5 text-[#E879F9] mb-2" />
                  <h4 className="font-display font-bold text-white text-sm">Lightning Network</h4>
                  <p className="text-xs text-[#A19DB5] mt-1">Flash rates, strike density & convective jumps</p>
                </div>
                <div className="raze-card p-4">
                  <Wind className="w-5 h-5 text-amber-400 mb-2" />
                  <h4 className="font-display font-bold text-white text-sm">NWP Ensemble</h4>
                  <p className="text-xs text-[#A19DB5] mt-1">CAPE, CIN, shear & moisture convergence</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="raze-card p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#A855F7]/20">
                  <div>
                    <h3 className="font-display font-bold text-white text-lg tracking-wide">
                      Active Severe Storm Tracking
                    </h3>
                    <div className="text-xs font-mono text-[#C084FC]">SECTOR: BHOPAL CENTRAL MET GRID</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] text-xs font-mono font-bold animate-pulse">
                    CRITICAL SEVERE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-xs text-[#A19DB5]">Active Storms</div>
                    <div className="text-xl font-bold text-white mt-1">3 Cells</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-xs text-[#A19DB5]">Storm Movement</div>
                    <div className="text-xl font-bold text-[#C084FC] mt-1">36.5 km/h</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-xs text-[#A19DB5]">Lightning Activity</div>
                    <div className="text-xl font-bold text-[#E879F9] mt-1">42 strikes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-xs text-[#A19DB5]">Precipitation</div>
                    <div className="text-xl font-bold text-blue-400 mt-1">26.5 mm/h</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#08070C]/90 border border-[#A855F7]/30 space-y-2 text-xs font-mono text-[#A19DB5]">
                  <div className="flex justify-between text-white">
                    <span>Current Propagation Vector:</span>
                    <span className="text-[#C084FC] font-semibold">Azimuth 55° (NE) @ 36.5 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Echo Core Peak:</span>
                    <span className="text-[#EF4444] font-bold">58.4 dBZ (Hail & Downburst Threat)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4: PREDICT THE STORM - 30, 60, 120 MIN HORIZONS
          ================================================== */}
      <section className="relative overflow-hidden border-t border-[#A855F7]/20 bg-[#08070C] py-24 px-4 md:px-8 lg:px-12">
        <div className="raze-grid-guides opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#A855F7]/15">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#C084FC] uppercase">
                SECTION 03 / MULTI-HORIZON PROBABILITY
              </span>
              <div className="flex items-start mt-2">
                <span className="raze-drop-cap text-4xl md:text-5xl">W</span>
                <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight pt-1">
                  e Believe Safety Knows No Boundaries.
                </h2>
              </div>
            </div>
            <p className="text-xs font-mono text-[#A19DB5] max-w-md">
              Thunderstorm nowcasting requires ultra-short range probabilistic forecasts evaluated against genuine meteorological metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 30 Min Horizon */}
            <div className="raze-card p-6 border-[#EF4444]/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] group hover:border-[#EF4444] transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-[#EF4444]/20 text-[#EF4444] font-mono text-xs font-bold border border-[#EF4444]/40">
                  0–30 MIN
                </span>
                <span className="text-xs font-mono text-[#A19DB5]">AI Confidence: 92%</span>
              </div>
              <div className="text-5xl font-display font-black text-white mb-2">84.0%</div>
              <div className="text-sm font-semibold text-[#EF4444] uppercase tracking-wider mb-3">
                Severe Convective Horizon
              </div>
              <p className="text-xs text-[#A19DB5] leading-relaxed font-sans">
                Immediate convective impact. High probability of squall wind gusts exceeding 65 km/h, intense return-stroke lightning, and hail cores.
              </p>
            </div>

            {/* 60 Min Horizon */}
            <div className="raze-card p-6 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] group hover:border-amber-400 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40">
                  30–60 MIN
                </span>
                <span className="text-xs font-mono text-[#A19DB5]">AI Confidence: 88%</span>
              </div>
              <div className="text-5xl font-display font-black text-white mb-2">76.0%</div>
              <div className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
                High Risk Propagation
              </div>
              <p className="text-xs text-[#A19DB5] leading-relaxed font-sans">
                Cell propagation and boundary collision. Convective core moving northeastward with potential cell splitting and gust front triggering.
              </p>
            </div>

            {/* 120 Min Horizon */}
            <div className="raze-card p-6 border-[#A855F7]/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] group hover:border-[#C084FC] transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-[#A855F7]/20 text-[#C084FC] font-mono text-xs font-bold border border-[#A855F7]/40">
                  60–120 MIN
                </span>
                <span className="text-xs font-mono text-[#A19DB5]">AI Confidence: 81%</span>
              </div>
              <div className="text-5xl font-display font-black text-white mb-2">52.0%</div>
              <div className="text-sm font-semibold text-[#C084FC] uppercase tracking-wider mb-3">
                Moderate Risk Synoptic
              </div>
              <p className="text-xs text-[#A19DB5] leading-relaxed font-sans">
                Dissipation or squall line transition. Residual stratiform rain with moderate localized lightning and wind dissipation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 5: FINAL CTA
          ================================================== */}
      <section className="relative overflow-hidden border-t border-[#A855F7]/20 bg-[#08070C] py-24 px-4 md:px-8 lg:px-12">
        <div className="raze-grid-guides opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="p-10 md:p-16 rounded-3xl bg-[#0F0D17]/90 border border-[#A855F7]/35 relative overflow-hidden backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.2)]">
            <span className="text-xs font-mono tracking-widest text-[#C084FC] uppercase">
              OPERATIONAL DEPLOYMENT READY
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-black text-white mt-3 mb-6 tracking-tight">
              WHEN THE WEATHER CHANGES,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-white italic">
                KNOW BEFORE IT DOES.
              </span>
            </h2>
            <p className="text-[#A19DB5] text-sm md:text-base max-w-2xl mx-auto mb-8 font-sans">
              Access the complete meteorological operations center, explore Doppler nowcast extrapolation, and tune AI model hyper-parameters.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#A855F7] to-[#E879F9] text-white text-xs md:text-sm font-display font-extrabold uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] hover:scale-[1.03] transition-all"
              >
                <span>Open Live Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsStudioOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.05] border border-white/20 text-white text-xs md:text-sm font-display font-bold hover:border-[#C084FC] transition-all"
              >
                <Palette className="w-4 h-4 text-[#C084FC]" />
                <span>Adjust Color Grading</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 border-t border-[#A855F7]/20 bg-[#08070C] text-xs font-mono text-[#A19DB5] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-white font-display text-lg font-black tracking-wider">TEMPESTIQ</div>
            <div className="text-[10px] text-[#A19DB5]">PHYSICS-INFORMED NOWCASTING PLATFORM</div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[#A19DB5]">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/map" className="hover:text-white transition-colors">Live Map</Link>
            <Link to="/nowcast" className="hover:text-white transition-colors">Nowcast</Link>
            <Link to="/radar" className="hover:text-white transition-colors">Radar</Link>
            <Link to="/lightning" className="hover:text-white transition-colors">Lightning</Link>
            <Link to="/presentation" className="hover:text-white transition-colors">Presentation</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#A855F7]/15 text-center text-[11px] opacity-70">
          TempestIQ provides experimental probabilistic weather intelligence and does not replace official meteorological warnings.
        </div>
      </footer>

      {/* Global Color Grading Studio Modal */}
      <ColorGradingStudio />
    </div>
  );
};
