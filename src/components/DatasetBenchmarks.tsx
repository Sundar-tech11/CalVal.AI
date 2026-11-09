import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  Database,
  TrendingUp,
  Award,
  Layers,
  Activity,
  BarChart3,
  DollarSign,
  Compass,
  Sparkles
} from 'lucide-react';
import { DatasetStats, ModelComparisonItem, ModelId, ModelMeta } from '../types';
import { CountUp } from './CountUp';

interface DatasetBenchmarksProps {
  stats: DatasetStats;
  featureImportances: Array<{ feature: string; importance: number; code?: string }>;
  models?: Record<ModelId, ModelMeta>;
  multiModelComparison?: Record<string, ModelComparisonItem>;
  activeModelId?: ModelId;
  currentIncome?: number;
}

type AnalyticsTab = 'model_metrics' | 'predictions' | 'feature_importance' | 'income_curve' | 'ocean_submarkets';

const MODEL_COLORS: Record<string, string> = {
  xgboost: '#f59e0b', // Luxury Amber
  random_forest: '#eab308', // Warm Gold
  decision_tree: '#d97706', // Deep Ochre
  ridge: '#78716c' // Stone
};

const OCEAN_BAR_COLORS: Record<string, string> = {
  '<1H OCEAN': '#f59e0b',
  'NEAR BAY': '#d97706',
  'NEAR OCEAN': '#fbbf24',
  'INLAND': '#a8a29e',
  'ISLAND': '#10b981'
};

export const DatasetBenchmarks: React.FC<DatasetBenchmarksProps> = ({
  stats,
  featureImportances,
  models,
  multiModelComparison,
  activeModelId = 'xgboost',
  currentIncome = 3.87
}) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('model_metrics');
  const [metricSubTab, setMetricSubTab] = useState<'r2' | 'rmse' | 'mae'>('r2');

  // 1. Model Metric Comparison Data (R², RMSE, MAE from real metadata)
  const modelMetricsData = [
    {
      id: 'xgboost',
      name: 'XGBoost',
      fullName: 'XGBoost Regressor',
      r2: 0.8438,
      r2_pct: 84.4,
      rmse: 45473,
      mae: 30066,
      color: MODEL_COLORS.xgboost
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      fullName: 'Random Forest Regressor',
      r2: 0.8025,
      r2_pct: 80.3,
      rmse: 51125,
      mae: 33763,
      color: MODEL_COLORS.random_forest
    },
    {
      id: 'decision_tree',
      name: 'Decision Tree',
      fullName: 'Decision Tree Regressor',
      r2: 0.6861,
      r2_pct: 68.6,
      rmse: 64454,
      mae: 42253,
      color: MODEL_COLORS.decision_tree
    },
    {
      id: 'ridge',
      name: 'Ridge L2',
      fullName: 'Ridge Linear',
      r2: 0.6528,
      r2_pct: 65.3,
      rmse: 67793,
      mae: 49096,
      color: MODEL_COLORS.ridge
    }
  ];

  // 2. Live Prediction Comparison across 4 models
  const livePredictionsData = multiModelComparison
    ? Object.entries(multiModelComparison).map(([id, val]) => ({
        id,
        name: val.model_name.replace(' (Gradient Boosting)', '').replace(' Regressor', ''),
        prediction: val.prediction,
        r2: val.r2,
        isCurrent: id === activeModelId,
        color: id === activeModelId ? '#f59e0b' : (MODEL_COLORS[id] || '#78716c')
      }))
    : modelMetricsData.map((m) => ({
        id: m.id,
        name: m.name,
        prediction: 240000,
        r2: m.r2,
        isCurrent: m.id === activeModelId,
        color: m.color
      }));

  // 3. Feature Importance Data
  const importanceData = (featureImportances || []).slice(0, 8).map((item) => ({
    name: item.feature.length > 22 ? item.feature.slice(0, 20) + '...' : item.feature,
    fullName: item.feature,
    pct: Math.round(item.importance * 100),
    weight: item.importance
  }));

  // 4. Real Income vs House Value Data (20,640 records from census dataset)
  const incomeCurveData = (stats.income_vs_value_tiers || [
    { income_bracket: '< $20k', median_house_value: 93300, mean_house_value: 112497, sample_count: 2457 },
    { income_bracket: '$20k-$30k', median_house_value: 130800, mean_house_value: 144432, sample_count: 4946 },
    { income_bracket: '$30k-$40k', median_house_value: 171250, mean_house_value: 191026, sample_count: 5150 },
    { income_bracket: '$40k-$50k', median_house_value: 209450, mean_house_value: 227972, sample_count: 3598 },
    { income_bracket: '$50k-$60k', median_house_value: 253300, mean_house_value: 272822, sample_count: 2127 },
    { income_bracket: '$60k-$80k', median_house_value: 335900, mean_house_value: 344845, sample_count: 1672 },
    { income_bracket: '$80k-$100k', median_house_value: 477900, mean_house_value: 443245, sample_count: 382 },
    { income_bracket: '> $100k', median_house_value: 500001, mean_house_value: 482213, sample_count: 308 }
  ]).map((tier) => ({
    bracket: tier.income_bracket,
    median: tier.median_house_value,
    mean: tier.mean_house_value,
    count: tier.sample_count
  }));

  // 5. Ocean Proximity Submarket Valuation Data
  const oceanData = Object.entries(stats.price_by_ocean || {}).map(([key, val]) => ({
    category: key,
    median: Math.round(val.median),
    mean: Math.round(val.mean),
    count: val.count,
    color: OCEAN_BAR_COLORS[key] || '#f59e0b'
  }));

  return (
    <div id="dataset-benchmarks-card" className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-6 shadow-xl shadow-black/80 space-y-4">
      {/* Card Header with Real Census Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800/80">
        <div className="flex items-center gap-2.5">
          <Database className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif font-normal text-stone-100 text-base tracking-wide">
            Model & Dataset Intelligence Analytics
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span className="font-mono text-amber-300 font-semibold"><CountUp value={stats.count} duration={1.4} /></span>
          <span>Verified Census Records</span>
        </div>
      </div>

      {/* Analytics Tab Switcher */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-stone-950/80 border border-stone-800/80 rounded-xl text-xs">
        <button
          type="button"
          id="tab-analytics-model-metrics"
          onClick={() => setActiveTab('model_metrics')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'model_metrics'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Model Benchmarks (R² / RMSE / MAE)</span>
        </button>

        <button
          type="button"
          id="tab-analytics-predictions"
          onClick={() => setActiveTab('predictions')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'predictions'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Prediction Comparison (4 Models)</span>
        </button>

        <button
          type="button"
          id="tab-analytics-feature-importance"
          onClick={() => setActiveTab('feature_importance')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'feature_importance'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Feature Importance</span>
        </button>

        <button
          type="button"
          id="tab-analytics-income-curve"
          onClick={() => setActiveTab('income_curve')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'income_curve'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Income vs House Value</span>
        </button>

        <button
          type="button"
          id="tab-analytics-ocean"
          onClick={() => setActiveTab('ocean_submarkets')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ocean_submarkets'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Ocean Submarkets</span>
        </button>
      </div>

      {/* TAB 1: MODEL BENCHMARKS (R², RMSE, MAE COMPARISONS) */}
      {activeTab === 'model_metrics' && (
        <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-stone-200 block font-serif text-sm">
                Cross-Architecture Performance Evaluation
              </span>
              <span className="text-[11px] text-stone-400 font-light">
                Official test set metrics recorded on 4,128 holdout census blocks
              </span>
            </div>

            {/* Sub-metric selector */}
            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 self-start font-mono">
              <button
                type="button"
                id="btn-metric-r2"
                onClick={() => setMetricSubTab('r2')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  metricSubTab === 'r2'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Model R² Score
              </button>
              <button
                type="button"
                id="btn-metric-rmse"
                onClick={() => setMetricSubTab('rmse')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  metricSubTab === 'rmse'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                RMSE ($)
              </button>
              <button
                type="button"
                id="btn-metric-mae"
                onClick={() => setMetricSubTab('mae')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                  metricSubTab === 'mae'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                MAE ($)
              </button>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {metricSubTab === 'r2' ? (
                <BarChart data={modelMetricsData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <YAxis domain={[0, 1.0]} tick={{ fill: '#a8a29e', fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0e12', borderColor: '#44403c', borderRadius: '10px', fontSize: '11px' }}
                    formatter={(value: any) => [`${(Number(value) * 100).toFixed(2)}% (R²: ${value})`, 'R² Score']}
                  />
                  <Bar dataKey="r2" radius={[6, 6, 0, 0]}>
                    {modelMetricsData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.id === activeModelId ? '#f59e0b' : entry.color}
                        stroke={entry.id === activeModelId ? '#fbbf24' : 'transparent'}
                        strokeWidth={entry.id === activeModelId ? 1.5 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : metricSubTab === 'rmse' ? (
                <BarChart data={modelMetricsData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0e12', borderColor: '#44403c', borderRadius: '10px', fontSize: '11px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'RMSE (Root Mean Squared Error)']}
                  />
                  <Bar dataKey="rmse" radius={[6, 6, 0, 0]}>
                    {modelMetricsData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.id === activeModelId ? '#f59e0b' : entry.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={modelMetricsData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0e12', borderColor: '#44403c', borderRadius: '10px', fontSize: '11px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'MAE (Mean Absolute Error)']}
                  />
                  <Bar dataKey="mae" radius={[6, 6, 0, 0]}>
                    {modelMetricsData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.id === activeModelId ? '#f59e0b' : entry.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-stone-800/80 text-[11px] text-center">
            {modelMetricsData.map((m) => (
              <div
                key={m.id}
                className={`p-2 rounded-xl border hover-pill-subtle cursor-default ${
                  m.id === activeModelId
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-stone-900/50 border-stone-800/60 text-stone-400'
                }`}
              >
                <div className="font-medium font-serif">{m.name}</div>
                <div className="font-mono text-stone-200 font-semibold">
                  {metricSubTab === 'r2' ? (
                    <CountUp value={m.r2 * 100} decimals={1} suffix="%" duration={0.9} />
                  ) : metricSubTab === 'rmse' ? (
                    <span>$<CountUp value={Math.round(m.rmse / 1000)} suffix="k" duration={0.9} /></span>
                  ) : (
                    <span>$<CountUp value={Math.round(m.mae / 1000)} suffix="k" duration={0.9} /></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PREDICTION COMPARISON ACROSS 4 MODELS */}
      {activeTab === 'predictions' && (
        <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-200 block font-serif text-sm">
                Active Property Valuation Across 4 Production Models
              </span>
              <span className="text-[11px] text-stone-400 font-light">
                Comparing current inputs across gradient boosted, bagged ensemble, CART, and linear architectures
              </span>
            </div>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={livePredictionsData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#a8a29e', fontSize: 11 }} />
                <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c0e12', borderColor: '#44403c', borderRadius: '10px', fontSize: '11px' }}
                  formatter={(value: any, name: any, item: any) => [
                    `$${Number(value).toLocaleString()} (R²: ${item.payload.r2})`,
                    'Predicted Value'
                  ]}
                />
                <Bar dataKey="prediction" radius={[6, 6, 0, 0]}>
                  {livePredictionsData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.id === activeModelId ? '#f59e0b' : entry.color}
                      stroke={entry.id === activeModelId ? '#fbbf24' : 'transparent'}
                      strokeWidth={entry.id === activeModelId ? 1.5 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE IMPORTANCE */}
      {activeTab === 'feature_importance' && (
        <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div>
            <span className="text-xs font-semibold text-stone-200 block font-serif text-sm">
              Global Gini Feature Importances (Tree Ensemble)
            </span>
            <span className="text-[11px] text-stone-400 font-light">
              Proportion of tree split variance attributed to each demographic and structural feature
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {importanceData.map((f, i) => (
              <div key={f.fullName} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">{f.fullName}</span>
                  <span className="text-amber-300 font-semibold">{f.pct}% weight</span>
                </div>
                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                    style={{ width: `${Math.max(4, f.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INCOME VS HOUSE VALUE CURVE */}
      {activeTab === 'income_curve' && (
        <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div>
            <span className="text-xs font-semibold text-stone-200 block font-serif text-sm">
              California Census Empirical Income-to-Value Curve
            </span>
            <span className="text-[11px] text-stone-400 font-light">
              Aggregated median and mean housing values across income brackets for all 20,640 blocks
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeCurveData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="bracket" tick={{ fill: '#a8a29e', fontSize: 10 }} />
                <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c0e12', borderColor: '#44403c', borderRadius: '10px', fontSize: '11px' }}
                  formatter={(value: any, name: any) => [`$${Number(value).toLocaleString()}`, name === 'median' ? 'Median Value' : 'Mean Value']}
                />
                <Line type="monotone" dataKey="median" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} name="median" />
                <Line type="monotone" dataKey="mean" stroke="#a8a29e" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: '#a8a29e', r: 3 }} name="mean" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 5: OCEAN PROXIMITY SUBMARKETS */}
      {activeTab === 'ocean_submarkets' && (
        <div className="bg-stone-950/70 p-4 rounded-xl border border-stone-800/80 space-y-3">
          <div>
            <span className="text-xs font-semibold text-stone-200 block font-serif text-sm">
              California Submarket Valuation by Ocean Proximity
            </span>
            <span className="text-[11px] text-stone-400 font-light">
              Statewide census median property values categorised by coastal buffer
            </span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oceanData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: '#a8a29e', fontSize: 10 }} />
                <YAxis tick={{ fill: '#a8a29e', fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c0e12', borderColor: '#44403c', borderRadius: '10px', fontSize: '11px' }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Submarket Median']}
                />
                <Bar dataKey="median" radius={[6, 6, 0, 0]}>
                  {oceanData.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
