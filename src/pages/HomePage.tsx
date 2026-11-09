import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import {
  HouseFeatures,
  LocationPreset,
  PredictionResult,
  DatasetStats,
  ModelId,
  ModelMeta
} from '../types';
import {
  Sparkles,
  MapPin,
  Layers,
  BarChart3,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Compass,
  Cpu
} from 'lucide-react';

interface HomePageProps {
  features: HouseFeatures;
  presets: LocationPreset[];
  prediction: PredictionResult | null;
  stats: DatasetStats | null;
  selectedModel: ModelId;
  models: Record<ModelId, ModelMeta>;
  onApplyPreset: (preset: LocationPreset) => void;
  onQuickEstimate: (updated: Partial<HouseFeatures>) => void;
  onNavigateToValuation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  features,
  presets,
  prediction,
  stats,
  selectedModel,
  models,
  onApplyPreset,
  onQuickEstimate,
  onNavigateToValuation
}) => {
  const activeModelMeta = models[selectedModel];

  const suiteModules = [
    {
      title: 'Property Valuation Studio',
      path: '/valuation',
      badge: 'Section 01',
      desc: 'Interactive 10-feature appraisal interface with continuous demographic sliders, submarket anchors, and confidence intervals.',
      metric: prediction ? `$${prediction.predicted_value.toLocaleString()}` : '$500,001',
      metricLabel: 'Live Estimate',
      icon: Sparkles,
      color: 'text-amber-400',
      borderColor: 'group-hover:border-amber-500/50'
    },
    {
      title: 'California Spatial Map',
      path: '/california-map',
      badge: 'Section 02',
      desc: 'Interactive cartography and submarket coordinate pinpointing across coastal, bay, inland, and island boundaries.',
      metric: `${features.latitude.toFixed(2)}°N, ${Math.abs(features.longitude).toFixed(2)}°W`,
      metricLabel: 'Current Anchor',
      icon: MapPin,
      color: 'text-sky-400',
      borderColor: 'group-hover:border-sky-500/50'
    },
    {
      title: 'Model Consensus',
      path: '/consensus',
      badge: 'Section 03',
      desc: 'Simultaneous cross-validation across XGBoost, Random Forest, Decision Tree, and Ridge Linear Regression.',
      metric: '4 Models',
      metricLabel: 'Parallel Inference',
      icon: Layers,
      color: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-500/50'
    },
    {
      title: 'Market Analytics',
      path: '/analytics',
      badge: 'Section 04',
      desc: 'Empirical income curves, Gini feature importance rankings, and price distributions across 20,640 census block groups.',
      metric: stats ? `${stats.count.toLocaleString()} Blocks` : '20,640 Blocks',
      metricLabel: 'Census Records',
      icon: BarChart3,
      color: 'text-violet-400',
      borderColor: 'group-hover:border-violet-500/50'
    },
    {
      title: 'Explainable AI (XAI)',
      path: '/explainable-ai',
      badge: 'Section 05',
      desc: 'Marginal sensitivity attribution decomposing property valuations into positive asset premiums and negative adjustments.',
      metric: prediction ? `${prediction.contributions.length} Drivers` : '6 Drivers',
      metricLabel: 'Marginal Factors',
      icon: TrendingUp,
      color: 'text-amber-300',
      borderColor: 'group-hover:border-amber-400/50'
    },
    {
      title: 'Methodology & Process',
      path: '/methodology',
      badge: 'Section 06',
      desc: 'Institutional 3-step pipeline: 10-feature standardization, quad-model consensus, and geographic boundary grounding.',
      metric: '84.4% R²',
      metricLabel: 'XGBoost Precision',
      icon: HelpCircle,
      color: 'text-rose-400',
      borderColor: 'group-hover:border-rose-500/50'
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <Hero
        features={features}
        presets={presets}
        onApplyPreset={onApplyPreset}
        onQuickEstimate={onQuickEstimate}
        onNavigateToValuation={onNavigateToValuation}
      />

      {/* Maison Estate Architecture Suite Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Valuation Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-serif text-stone-50 tracking-tight">
              Explore the <span className="italic font-normal text-amber-200">Valuation Suite</span>
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light mt-1 max-w-2xl">
              Navigate between specialized modules for property estimation, cartographic intelligence, multi-model consensus, empirical analytics, and explainable AI.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/valuation"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition shadow-md shadow-amber-950/40 inline-flex items-center gap-2"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 6 Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suiteModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.path}
                to={mod.path}
                className={`group p-6 rounded-2xl bg-stone-900/70 hover:bg-stone-900/90 border border-stone-800/90 ${mod.borderColor} transition-all duration-200 flex flex-col justify-between space-y-6 hover:shadow-xl hover:shadow-black/40`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800">
                      {mod.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-300 group-hover:text-amber-300 group-hover:border-amber-500/40 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-light text-stone-100 group-hover:text-amber-200 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-stone-300 font-light leading-relaxed mt-1.5">
                      {mod.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">
                      {mod.metricLabel}
                    </span>
                    <span className="text-sm font-mono font-medium text-stone-200">
                      {mod.metric}
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Institutional Confidence Strip */}
        <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800/90 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-300 font-light">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <strong className="text-stone-100 font-medium block">Rigorous Empirical Validation</strong>
              <span className="text-stone-300">Every estimate is synthesized against 20,640 census block groups with documented cross-validation metrics.</span>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
            <div className="text-right">
              <span className="text-stone-400 block">Active Engine</span>
              <span className="text-amber-300 font-medium">{activeModelMeta ? activeModelMeta.name : 'XGBoost'}</span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div className="text-right">
              <span className="text-stone-400 block">Census Baseline</span>
              <span className="text-stone-200 font-medium">$179,700 Median</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
