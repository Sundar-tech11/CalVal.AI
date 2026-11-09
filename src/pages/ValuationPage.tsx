import React from 'react';
import { Link } from 'react-router-dom';
import { PredictionForm } from '../components/ValuationControls';
import { PredictionResultCard } from '../components/PredictionResultCard';
import {
  HouseFeatures,
  LocationPreset,
  ModelId,
  ModelMeta,
  PredictionResult
} from '../types';
import { Sparkles, ArrowLeft, ArrowRight, MapPin, Layers, BarChart3, TrendingUp } from 'lucide-react';
import valuationBgImg from '../assets/images/luxury_interior_california_1789577033481.jpg';

interface ValuationPageProps {
  features: HouseFeatures;
  selectedModel: ModelId;
  models: Record<ModelId, ModelMeta>;
  presets: LocationPreset[];
  prediction: PredictionResult | null;
  onChange: (updated: Partial<HouseFeatures>) => void;
  onSelectModel: (modelId: ModelId) => void;
  onApplyPreset: (preset: LocationPreset) => void;
}

export const ValuationPage: React.FC<ValuationPageProps> = ({
  features,
  selectedModel,
  models,
  presets,
  prediction,
  onChange,
  onSelectModel,
  onApplyPreset
}) => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex-1 overflow-hidden">
      {/* LAYER 1: Background Photograph (Dedicated layer, z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={valuationBgImg}
          alt="Luxury California Property Interior"
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
          <span className="text-amber-300 font-medium">Property Valuation Studio</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-stone-300">Step 1 of 6</span>
          <Link to="/california-map" className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1">
            <span>Next: Spatial Map</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Section 01</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-serif text-stone-50 tracking-tight">
            Property Valuation <span className="italic font-normal text-amber-200">Studio</span>
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-light mt-1 max-w-xl">
            Fine-tune residential features, demographic inputs, and architectural parameters to compute an immediate machine learning appraisal.
          </p>
        </div>
        <div className="text-right hidden md:block text-xs font-mono text-stone-300">
          <span>StandardScaler Pipeline</span>
          <span className="mx-2">•</span>
          <span className="text-amber-300 font-medium">Live Compute</span>
        </div>
      </div>

      {/* Main Valuation Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Valuation Form Controls */}
        <div className="md:col-span-6 lg:col-span-7">
          <PredictionForm
            features={features}
            onChange={onChange}
            selectedModel={selectedModel}
            onSelectModel={onSelectModel}
            models={models}
            presets={presets}
            onApplyPreset={onApplyPreset}
          />
        </div>

        {/* Right Column: Prediction Result Display Card */}
        <div className="md:col-span-6 lg:col-span-5 sticky top-24 space-y-6">
          {prediction ? (
            <PredictionResultCard
              result={prediction}
              features={features}
              locationPreset={
                presets.find(
                  (p) =>
                    Math.abs(p.values.latitude - features.latitude) < 0.08 &&
                    Math.abs(p.values.longitude - features.longitude) < 0.08
                )?.name.split('/')[0].trim()
              }
            />
          ) : (
            <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-8 text-center text-stone-500 font-light">
              Calculating residential valuation...
            </div>
          )}

          {/* Quick Cross-Navigation Links */}
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/80 space-y-2.5 text-xs">
            <span className="text-[10px] uppercase font-mono text-stone-400 block">
              Deepen Analysis
            </span>
            <div className="grid grid-cols-2 gap-2 font-light">
              <Link
                to="/california-map"
                className="p-2.5 rounded-lg bg-stone-950/70 hover:bg-stone-800/60 border border-stone-800/80 text-stone-300 hover:text-amber-300 transition flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Spatial Map</span>
              </Link>
              <Link
                to="/consensus"
                className="p-2.5 rounded-lg bg-stone-950/70 hover:bg-stone-800/60 border border-stone-800/80 text-stone-300 hover:text-amber-300 transition flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4-Model Consensus</span>
              </Link>
              <Link
                to="/analytics"
                className="p-2.5 rounded-lg bg-stone-950/70 hover:bg-stone-800/60 border border-stone-800/80 text-stone-300 hover:text-amber-300 transition flex items-center gap-2"
              >
                <BarChart3 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Census Benchmarks</span>
              </Link>
              <Link
                to="/explainable-ai"
                className="p-2.5 rounded-lg bg-stone-950/70 hover:bg-stone-800/60 border border-stone-800/80 text-stone-300 hover:text-amber-300 transition flex items-center gap-2"
              >
                <TrendingUp className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span>XAI Attribution</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Quick Appraisal Bar (< md screens) */}
      {prediction && (
        <div className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-stone-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-mono text-stone-400 block truncate">
              {prediction.model_name.split(' ')[0]} Live Estimate
            </span>
            <div className="text-base font-serif font-bold text-amber-200">
              ${prediction.predicted_value.toLocaleString()} <span className="text-[10px] font-sans font-light text-stone-400">USD</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const cardEl = document.getElementById('prediction-result-card');
              cardEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              const saveBtn = document.getElementById('btn-save-appraisal');
              if (saveBtn) {
                saveBtn.focus();
                saveBtn.classList.add('ring-2', 'ring-amber-400');
                setTimeout(() => saveBtn.classList.remove('ring-2', 'ring-amber-400'), 2000);
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 active:from-amber-600 active:to-amber-700 text-stone-950 font-semibold text-xs shrink-0 shadow-lg shadow-amber-950/50 flex items-center gap-1.5 cursor-pointer hover-control-gold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save Appraisal</span>
          </button>
        </div>
      )}
    </div>
  </div>
  );
};
