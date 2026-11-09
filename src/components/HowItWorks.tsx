import React from 'react';
import { Sparkles, Cpu, Layers, BarChart3, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import interiorImg from '../assets/images/luxury_interior_california_1789577033481.jpg';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Census Demographics & Feature Engineering',
      description:
        'CalVal.AI ingests 8 foundational census dimensions across 20,640 California blocks and engineers high-signal structural ratios: Bedrooms-per-Room, Rooms-per-Household, and Population Occupancy density, normalized via rigorous StandardScaler transforms.',
      badge: '10-Feature Pipeline'
    },
    {
      number: '02',
      title: 'Quad-Model Ensemble Cross-Validation',
      description:
        'Your input is evaluated across four distinct predictive architectures—XGBoost Gradient Boosted Trees, Random Forest, L2-Regularized Ridge, and Decision Tree—delivering both specialized predictions and consensus bounds.',
      badge: 'Cross-Model Consensus'
    },
    {
      number: '03',
      title: 'Spatial Coordinates & Explainable XAI',
      description:
        'Estimates are grounded against geographic coordinates and ocean proximity tiers (<1H Ocean, Bay Area, Coastal Pacific, Inland Valley). Transparent SHAP marginal attributions explain exactly which factors drive the valuation premium.',
      badge: 'Transparent Attribution'
    }
  ];

  return (
    <section id="methodology" className="py-20 bg-[#0e1015] border-t border-b border-stone-800/80 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Methodology & Machine Learning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif text-stone-100 tracking-tight mb-4">
            How <span className="italic font-normal text-amber-200">CalVal.AI</span> Works
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Bridging institutional econometrics and modern artificial intelligence to produce explainable residential valuations.
          </p>
        </div>

        {/* Bento Grid: Steps & Architectural Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Editorial Process Cards */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-stone-900/60 border border-stone-800/90 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm group hover-card-premium"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-serif text-amber-400/80 font-light tracking-wider shrink-0 pt-0.5 group-hover:text-amber-300 transition-colors">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-medium text-stone-100 font-serif">
                        {step.title}
                      </h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-300/90 border border-stone-700">
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Editorial Image & Specs Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl shadow-black/80 group hover-card-premium">
              <img
                src={interiorImg}
                alt="Refined Modern California Interior"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11] via-[#0b0d11]/40 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-6 text-left space-y-2">
                <span className="text-[10px] tracking-widest uppercase font-mono text-amber-300 font-semibold">
                  Institutional Calibration
                </span>
                <h4 className="text-lg font-serif text-stone-100 font-normal">
                  Pace & Barry California Census Standard
                </h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  Calibrated against 1990 U.S. Census enumeration data representing over 30 million residents across California block groups.
                </p>
                <div className="pt-2 flex items-center gap-3 text-[11px] text-amber-300/90 font-mono">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> 16,512 Train Samples
                  </span>
                  <span>•</span>
                  <span>4,128 Test Blocks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
