import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight, MapPin, DollarSign, Compass } from 'lucide-react';
import { HouseFeatures, LocationPreset, OceanProximity } from '../types';
import { CountUp } from './CountUp';
import heroImg from '../assets/images/luxury_california_home_1789577019762.jpg';

interface HeroProps {
  features: HouseFeatures;
  presets: LocationPreset[];
  onApplyPreset: (preset: LocationPreset) => void;
  onQuickEstimate: (updated: Partial<HouseFeatures>) => void;
  onNavigateToValuation?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  features,
  presets,
  onApplyPreset,
  onQuickEstimate,
  onNavigateToValuation
}) => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0]?.id || 'palo_alto');
  const [incomeTier, setIncomeTier] = useState<number>(features.median_income);
  const [oceanTier, setOceanTier] = useState<OceanProximity>(features.ocean_proximity);

  // Parallax: background moves slower than foreground scrolling
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : 130]
  );

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = presets.find((p) => p.id === selectedPresetId);
    if (preset) {
      onApplyPreset({
        ...preset,
        values: {
          ...preset.values,
          median_income: incomeTier,
          ocean_proximity: oceanTier
        }
      });
    } else {
      onQuickEstimate({
        median_income: incomeTier,
        ocean_proximity: oceanTier
      });
    }
    if (onNavigateToValuation) {
      onNavigateToValuation();
    } else {
      navigate('/valuation');
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-stone-800/60 bg-[#0b0d11]"
    >
      {/* LAYER 1: Background Photograph with Subtle Parallax */}
      <motion.div
        style={{ y: backgroundY, willChange: 'transform' }}
        className="absolute -inset-y-16 inset-x-0 z-0 pointer-events-none overflow-hidden"
      >
        <img
          src={heroImg}
          alt="Luxury California Architectural Residence"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
      </motion.div>

      {/* LAYER 2: Dark Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d11]/95 via-[#0b0d11]/75 to-[#0b0d11]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-transparent to-[#0b0d11]/60" />
      </div>

      {/* LAYER 3: Sharp CalVal.AI Hero Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col items-center text-center">
        {/* Editorial Sub-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase mb-6 backdrop-blur-md shadow-lg shadow-black/40 hover:border-amber-400/60 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span className="font-serif italic font-normal">CalVal.AI</span>
          <span className="text-stone-500">•</span>
          <span className="font-medium">California Algorithmic Valuation</span>
        </div>

        {/* Large Editorial Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-stone-50 max-w-4xl font-serif leading-[1.1] mb-6">
          Know What Your <br />
          <span className="italic font-normal text-amber-200">California Home</span> Is Worth
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-stone-300 max-w-2xl font-light leading-relaxed mb-10">
          State-of-the-art machine learning algorithms trained across 20,640 census block groups.
          Experience transparent, real-time property valuation powered by gradient boosting and spatial intelligence.
        </p>

        {/* Compact Valuation Search Bar (Maison Estate Style) */}
        <div className="w-full max-w-4xl bg-stone-900/90 border border-stone-700/60 hover:border-stone-600 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 backdrop-blur-xl mb-8 transition-colors">
          <form onSubmit={handleHeroSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            {/* 1. Submarket preset */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-2.5 text-left transition-all duration-200 hover:border-amber-500/50 hover:bg-stone-950/90 hover:shadow-[0_0_12px_-2px_rgba(245,158,11,0.15)]">
              <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300/80 font-medium mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Submarket</span>
              </label>
              <select
                id="hero-preset-select"
                value={selectedPresetId}
                onChange={(e) => {
                  setSelectedPresetId(e.target.value);
                  const p = presets.find((item) => item.id === e.target.value);
                  if (p) {
                    setIncomeTier(p.values.median_income);
                    setOceanTier(p.values.ocean_proximity);
                  }
                }}
                className="w-full bg-transparent text-stone-100 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-stone-900 text-stone-100">
                    {p.name.split('/')[0].trim()} ({p.values.ocean_proximity})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Ocean Proximity */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-2.5 text-left transition-all duration-200 hover:border-amber-500/50 hover:bg-stone-950/90 hover:shadow-[0_0_12px_-2px_rgba(245,158,11,0.15)]">
              <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300/80 font-medium mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Ocean Proximity</span>
              </label>
              <select
                id="hero-ocean-select"
                value={oceanTier}
                onChange={(e) => setOceanTier(e.target.value as OceanProximity)}
                className="w-full bg-transparent text-stone-100 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="NEAR BAY" className="bg-stone-900 text-stone-100">SF Bay Area</option>
                <option value="NEAR OCEAN" className="bg-stone-900 text-stone-100">Coastal Pacific</option>
                <option value="<1H OCEAN" className="bg-stone-900 text-stone-100">&lt;1 Hour Ocean</option>
                <option value="INLAND" className="bg-stone-900 text-stone-100">Inland Valley</option>
                <option value="ISLAND" className="bg-stone-900 text-stone-100">Channel Islands</option>
              </select>
            </div>

            {/* 3. Household Income */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-2.5 text-left transition-all duration-200 hover:border-amber-500/50 hover:bg-stone-950/90 hover:shadow-[0_0_12px_-2px_rgba(245,158,11,0.15)]">
              <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300/80 font-medium mb-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Median Income</span>
              </label>
              <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-stone-200">
                <span>${Math.round(incomeTier * 10000).toLocaleString()}/yr</span>
                <span className="text-[11px] text-stone-400 font-sans">
                  ({incomeTier.toFixed(1)}×)
                </span>
              </div>
            </div>

            {/* 4. Primary CTA Button */}
            <button
              id="hero-cta-estimate-btn"
              type="submit"
              className="w-full h-full min-h-[50px] px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer group hover-control-gold"
            >
              <span>Estimate Property Value</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        {/* Real Estate Benchmarks Ticker with Smooth CountUp Animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl w-full pt-4 border-t border-stone-800/60 text-stone-400 text-xs">
          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <div className="text-xl sm:text-2xl font-serif text-stone-100 font-medium tracking-tight">
              <CountUp value={20640} duration={1.4} />
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Census Block Groups</div>
          </div>
          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <div className="text-xl sm:text-2xl font-serif text-stone-100 font-medium tracking-tight">
              4 Architectures
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">XGBoost, RF, Ridge, Tree</div>
          </div>
          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <div className="text-xl sm:text-2xl font-serif text-amber-200 font-medium tracking-tight">
              <CountUp value={84.4} decimals={1} suffix="% R²" duration={1.3} />
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Top-Tier Precision</div>
          </div>
          <div className="transition-transform duration-200 hover:-translate-y-0.5">
            <div className="text-xl sm:text-2xl font-serif text-stone-100 font-medium tracking-tight">
              SHAP & XAI
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Full Factor Transparency</div>
          </div>
        </div>
      </div>
    </section>
  );
};

