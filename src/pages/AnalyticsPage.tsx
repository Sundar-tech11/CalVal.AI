import React from 'react';
import { Link } from 'react-router-dom';
import { DatasetBenchmarks } from '../components/DatasetBenchmarks';
import {
  DatasetStats,
  FeatureImportance,
  ModelId,
  ModelMeta,
  MultiModelComparison,
  PredictionResult
} from '../types';
import { BarChart3, ArrowLeft, ArrowRight, Sparkles, Database } from 'lucide-react';

interface AnalyticsPageProps {
  stats: DatasetStats | null;
  prediction: PredictionResult | null;
  models: Record<ModelId, ModelMeta>;
  selectedModel: ModelId;
  currentIncome: number;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  stats,
  prediction,
  models,
  selectedModel,
  currentIncome
}) => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex-1 overflow-hidden">
      {/* LAYER 1: Background Photograph (Dedicated layer, z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2400&auto=format&fit=crop"
          alt="California Bay Area City Real Estate Skyline at Twilight"
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
          <span className="text-amber-300 font-medium">Market Analytics & Census Benchmarks</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Link to="/consensus" className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Consensus</span>
          </Link>
          <span className="text-stone-600">•</span>
          <Link to="/explainable-ai" className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1">
            <span>Next: XAI</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Section 04</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-serif text-stone-50 tracking-tight">
            Market Analytics & <span className="italic font-normal text-amber-200">Census Benchmarks</span>
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-light mt-1 max-w-xl">
            Empirical distributions, Gini feature importance curves, and ocean proximity valuation charts across all 20,640 California census block groups.
          </p>
        </div>
        <div className="text-right hidden md:block text-xs font-mono text-stone-300">
          <span>20,640 Census Records</span>
          <span className="mx-2">•</span>
          <span className="text-amber-300 font-medium">Interactive Charts</span>
        </div>
      </div>

      {/* Dataset Benchmarks Component */}
      {stats && prediction ? (
        <DatasetBenchmarks
          stats={stats}
          featureImportances={prediction.feature_importances}
          models={models}
          multiModelComparison={prediction.multi_model_comparison}
          activeModelId={selectedModel}
          currentIncome={currentIncome}
        />
      ) : (
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-12 text-center text-stone-500 font-light">
          Loading California census analytics & distributions...
        </div>
      )}

      {/* Analytics Provenance Card */}
      <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400 font-light">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <strong className="text-stone-200 font-medium block">StatLib / US Census Provenance</strong>
            <span>Derived from the 1990 U.S. Census enumeration of California block groups with standard outlier adjustments.</span>
          </div>
        </div>
        <Link
          to="/valuation"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition shadow-sm shadow-amber-950/30 flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply in Valuation Studio</span>
        </Link>
      </div>
    </div>
  </div>
  );
};
