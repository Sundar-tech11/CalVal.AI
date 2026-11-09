import React from 'react';
import { Layers, Check, Sparkles, TrendingUp, Cpu } from 'lucide-react';
import { ModelComparisonItem, ModelId } from '../types';
import { CountUp } from './CountUp';

interface ModelComparisonProps {
  comparison: Record<string, ModelComparisonItem>;
  activeModelId: ModelId;
  onSelectModel: (id: ModelId) => void;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({
  comparison,
  activeModelId,
  onSelectModel
}) => {
  const modelEntries = Object.entries(comparison);
  if (modelEntries.length === 0) return null;

  const predictions = modelEntries.map(([_, v]) => v.prediction);
  const consensusMean = Math.round(predictions.reduce((a, b) => a + b, 0) / predictions.length);
  const maxPred = Math.max(...predictions, 1);

  return (
    <div id="model-comparison-card" className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-6 shadow-xl shadow-black/80 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800/80">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif font-normal text-stone-100 text-base tracking-wide">
            Multi-Model Architecture Consensus
          </h3>
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Consensus Mean: <strong className="text-amber-300 font-serif text-sm"><CountUp value={consensusMean} prefix="$" duration={1.2} /></strong>
        </div>
      </div>

      <p className="text-xs text-stone-400 font-light leading-relaxed">
        Select any architecture below to inspect localized sensitivity, compare institutional algorithms, and update the active appraisal pipeline.
      </p>

      {/* 4 Interactive Model Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {modelEntries.map(([id, item]) => {
          const isCurrent = id === activeModelId;
          const deltaVsConsensus = item.prediction - consensusMean;
          const deltaPct = Math.round((deltaVsConsensus / consensusMean) * 100);
          const barPct = Math.min(100, Math.max(12, (item.prediction / maxPred) * 100));

          return (
            <button
              key={id}
              id={`consensus-card-${id}`}
              type="button"
              onClick={() => onSelectModel(id as ModelId)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between group hover-card-premium ${
                isCurrent
                  ? 'bg-stone-900 border-amber-500/90 ring-1 ring-amber-500/40 text-white shadow-lg shadow-amber-950/20'
                  : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-900/60 hover:border-amber-500/40 text-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-stone-100 font-serif text-sm">
                    {item.model_name.replace(' (Gradient Boosting)', '').replace(' Regressor', '')}
                  </span>
                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-mono border border-amber-500/30">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500 group-hover:text-amber-400 transition-colors font-mono">
                      Select
                    </span>
                  )}
                </div>

                <div className="text-2xl font-serif text-stone-50 tracking-tight font-medium">
                  $<CountUp value={item.prediction} duration={1.1} />
                </div>

                {/* Relative valuation bar */}
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCurrent ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-stone-600 group-hover:bg-amber-400/70'
                    }`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>

              {/* Recorded Performance Metrics (R², RMSE, MAE) */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 space-y-1.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-stone-400">
                  <span>R² Score:</span>
                  <strong className="text-amber-200 font-medium">
                    <CountUp value={item.r2} decimals={4} duration={0.9} />
                  </strong>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>RMSE:</span>
                  <strong className="text-stone-300">
                    $<CountUp value={Math.round(item.rmse)} duration={1.0} />
                  </strong>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>MAE:</span>
                  <strong className="text-stone-300">
                    $<CountUp value={Math.round(item.mae)} duration={1.0} />
                  </strong>
                </div>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-stone-500">vs Consensus:</span>
                  <span
                    className={`font-semibold ${
                      deltaPct >= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {deltaPct >= 0 ? '+' : ''}{deltaPct}% (${deltaVsConsensus >= 0 ? '+' : ''}{deltaVsConsensus.toLocaleString()})
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
