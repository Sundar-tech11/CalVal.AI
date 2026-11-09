import React from 'react';
import { Link } from 'react-router-dom';
import { HowItWorks } from '../components/HowItWorks';
import { HelpCircle, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex-1 overflow-hidden">
      {/* LAYER 1: Background Photograph (Dedicated layer, z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2400&auto=format&fit=crop"
          alt="Cinematic California Mountain Landscape and Forest Canopy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      {/* LAYER 2: Dark Cinematic Gradient Overlay (Dedicated layer, z-[1]) */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d11]/92 via-[#0b0d11]/80 to-[#0b0d11]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(11,13,17,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[#0b0d11]/35" />
      </div>

      {/* LAYER 3: Sharp CalVal.AI Content (Dedicated layer, z-10) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-300 border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-stone-500">/</span>
          <span className="text-amber-300 font-medium">How CalVal.AI Works</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Link to="/explainable-ai" className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Explainable AI</span>
          </Link>
          <span className="text-stone-600">•</span>
          <Link to="/valuation" className="text-amber-400 hover:text-amber-300 font-medium transition inline-flex items-center gap-1">
            <span>Property Valuation Studio</span>
            <Sparkles className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* How It Works Component */}
      <HowItWorks />

      {/* Final Bottom Launch Strip */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-950 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-black/50">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-widest font-mono text-amber-400 block">
            Ready to Begin Valuation?
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-100 font-light">
            Experience Algorithmic Appraisal for Any California Parcel
          </h2>
          <p className="text-xs text-stone-400 font-light max-w-xl">
            Test custom income scenarios, test submarket premiums, and cross-validate estimates across all four machine learning architectures.
          </p>
        </div>
        <Link
          to="/valuation"
          className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-semibold tracking-wide transition shadow-lg shadow-amber-950/40 shrink-0 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Valuation Studio</span>
        </Link>
      </div>
    </div>
  </div>
  );
};
