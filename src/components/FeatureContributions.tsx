import React, { useState } from 'react';
import { BarChart3, Plus, Minus, Info, Filter, Sparkles, ShieldCheck } from 'lucide-react';
import { FeatureContribution } from '../types';
import { CountUp } from './CountUp';

interface FeatureContributionsProps {
  contributions: FeatureContribution[];
  baselineTarget: number;
  modelName?: string;
}

export const FeatureContributions: React.FC<FeatureContributionsProps> = ({
  contributions,
  baselineTarget,
  modelName = 'Active Model'
}) => {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filteredContributions = contributions.filter((c) => {
    if (filter === 'positive') return c.impact_dollars >= 0;
    if (filter === 'negative') return c.impact_dollars < 0;
    return true;
  });

  const maxAbsImpact = Math.max(...contributions.map((c) => Math.abs(c.impact_dollars)), 1);
  const positiveCount = contributions.filter((c) => c.impact_dollars >= 0).length;
  const negativeCount = contributions.filter((c) => c.impact_dollars < 0).length;

  return (
    <div id="feature-contributions-card" className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-6 shadow-xl shadow-black/80 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800/80">
        <div className="flex items-center gap-2.5">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif font-normal text-stone-100 text-base tracking-wide">
            Explainable AI (XAI) — Marginal Value Drivers
          </h3>
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Baseline Anchor: <strong className="text-amber-300 font-serif text-sm">$<CountUp value={baselineTarget} duration={1.2} /></strong>
        </div>
      </div>

      {/* Regulatory & Model Disclaimer Notice */}
      <div
        id="xai-disclaimer-banner"
        className="p-3.5 bg-stone-950/90 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200/90 hover-pill-subtle"
      >
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 font-light">
          <strong className="text-amber-300 font-medium block text-[11px] uppercase tracking-wider font-mono">
            Model-Based Attribution Notice (Non-Causal)
          </strong>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            Feature-impact estimates represent statistical attributions calculated via marginal sensitivity around California census baselines. These quantify model-internal weights, <strong>not causal guarantees</strong> or certified appraisals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
        <span className="text-stone-400 font-light">Ranked Feature Impact Drivers:</span>
        <div className="flex items-center gap-1.5 font-mono">
          <button
            type="button"
            id="filter-contrib-all"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer hover-pill-subtle ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            All ({contributions.length})
          </button>
          <button
            type="button"
            id="filter-contrib-positive"
            onClick={() => setFilter('positive')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 hover-pill-subtle ${
              filter === 'positive'
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50'
                : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            <Plus className="w-3 h-3 text-emerald-400" /> Positive ({positiveCount})
          </button>
          <button
            type="button"
            id="filter-contrib-negative"
            onClick={() => setFilter('negative')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 hover-pill-subtle ${
              filter === 'negative'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/50'
                : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
          >
            <Minus className="w-3 h-3 text-rose-400" /> Negative ({negativeCount})
          </button>
        </div>
      </div>

      {/* Ranked Feature Driver Rows */}
      <div className="space-y-2">
        {filteredContributions.map((c, idx) => {
          const isPositive = c.impact_dollars >= 0;
          const barWidthPct = Math.min(100, Math.max(6, (Math.abs(c.impact_dollars) / maxAbsImpact) * 100));

          return (
            <div
              key={c.feature || idx}
              id={`contrib-row-${c.feature}`}
              className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 hover-pill-subtle hover:border-amber-500/30 transition-all duration-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-stone-500 font-semibold w-4 text-center">
                    #{idx + 1}
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {isPositive ? <Plus className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
                  </span>
                  <span className="font-medium text-stone-200 font-serif text-sm">{c.label}</span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    (Input: {String(c.user_value)})
                  </span>
                </div>

                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <span
                    className={`font-semibold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? '+' : '-'}$<CountUp value={Math.abs(c.impact_dollars)} duration={0.9} />
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    <CountUp value={c.impact_pct} preserveSign suffix="%" duration={0.9} />
                  </span>
                </div>
              </div>

              {/* Relative Magnitude Bar */}
              <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${barWidthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
