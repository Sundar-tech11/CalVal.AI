
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FeatureContributions } from '../components/FeatureContributions';
import { DatasetStats, HouseFeatures, ModelId, PredictionResult } from '../types';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Info,
  RefreshCw,
} from 'lucide-react';

interface ExplainableAIPageProps {
  prediction: PredictionResult | null;
  stats: DatasetStats | null;
  features: HouseFeatures;
  selectedModel: ModelId;
}

interface ShapContribution {
  feature: string;
  label: string;
  user_value: number;
  impact_dollars: number;
  direction: 'positive' | 'negative';
}

interface ShapResponse {
  model_id: string;
  model_name: string;
  baseline_prediction: number;
  predicted_value: number;
  ranked_contributions: ShapContribution[];
  disclaimer: string;
  explanation_method?: string;
}

export const ExplainableAIPage: React.FC<ExplainableAIPageProps> = ({
  prediction,
  stats,
  features,
  selectedModel,
}) => {
  const [shapData, setShapData] = useState<ShapResponse | null>(null);
  const [shapError, setShapError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prediction) {
      setShapData(null);
      setShapError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchShap = async () => {
      setLoading(true);
      setShapError(null);

      try {
        const response = await fetch('/api/xai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            features: {
              ...features,
              median_income: features.median_income,
              housing_median_age: features.housing_median_age,
              total_rooms: features.total_rooms,
              total_bedrooms: features.total_bedrooms,
              population: features.population,
              households: features.households,
              latitude: features.latitude,
              longitude: features.longitude,
            },
            model_id: selectedModel,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Unable to load SHAP explanation',
          );
        }

        if (!Array.isArray(data.ranked_contributions)) {
          throw new Error(
            'The SHAP response has no ranked contributions',
          );
        }

        if (
          typeof data.predicted_value !== 'number' ||
          typeof data.baseline_prediction !== 'number'
        ) {
          throw new Error(
            'The SHAP response is missing prediction or baseline values',
          );
        }

        if (!cancelled) {
          setShapData(data as ShapResponse);
        }
      } catch (error) {
        if (!cancelled) {
          setShapData(null);
          setShapError(
            error instanceof Error
              ? error.message
              : 'Unable to load SHAP explanation',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchShap();

    return () => {
      cancelled = true;
    };
  }, [prediction, features, selectedModel]);

  const shapForDisplay = shapData
    ? {
        model_name: shapData.model_name,
        contributions: shapData.ranked_contributions.map((item) => ({
          feature: item.feature,
          label: item.label,
          user_value: item.user_value,
          impact_dollars: item.impact_dollars,
          impact: item.impact_dollars,
          direction: item.direction,
          contribution: item.impact_dollars,
          impact_pct:
            Math.abs(shapData.predicted_value) > 0
              ? Number(
                  (
                    (item.impact_dollars /
                      Math.abs(shapData.predicted_value)) *
                    100
                  ).toFixed(1),
                )
              : 0,
        })),
      }
    : null;

  const displayModelName =
    shapData?.model_name ||
    String(selectedModel).replace(/[_-]/g, ' ');

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex-1 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format&fit=crop"
          alt="Modern architectural interior"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d11]/92 via-[#0b0d11]/80 to-[#0b0d11]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(11,13,17,0.85)_100%)]" />
        <div className="absolute inset-0 bg-[#0b0d11]/35" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex items-center justify-between text-xs font-mono text-stone-300 border-b border-stone-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="text-stone-300 hover:text-amber-300 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-stone-500">/</span>
            <span className="text-amber-300 font-medium">
              Explainable AI &amp; Marginal Drivers
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <Link
              to="/analytics"
              className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Analytics</span>
            </Link>
            <span className="text-stone-600">•</span>
            <Link
              to="/methodology"
              className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1"
            >
              <span>Next: Methodology</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 05</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-light font-serif text-stone-50 tracking-tight">
              Explainable AI{' '}
              <span className="italic font-normal text-amber-200">
                &amp; Marginal Drivers
              </span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm font-light mt-1 max-w-xl">
              Explore real SHAP feature contributions for the selected
              valuation model relative to its reference data.
            </p>
          </div>

          <div className="text-right hidden md:block text-xs font-mono text-stone-300">
            <span>{shapData?.explanation_method || 'SHAP'}</span>
            <span className="mx-2">•</span>
            <span className="text-amber-300 font-medium">
              Non-Causal Attribution
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-amber-300 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Calculating SHAP contributions for {displayModelName}...
          </div>
        )}

        {shapError && (
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-200">
            <p className="font-semibold">
              Unable to load SHAP explanation
            </p>
            <p className="mt-1">{shapError}</p>
            <p className="mt-2 text-xs text-red-300/80">
              Check the server terminal for Python or API errors, then
              generate a new valuation.
            </p>
          </div>
        )}

        {shapData && shapForDisplay ? (
          <>
            <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-stone-400">
                  {displayModelName.toUpperCase()} SHAP BASELINE
                </p>
                <p className="text-2xl font-serif text-amber-300 mt-1">
                  $
                  {shapData.baseline_prediction.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs font-mono text-stone-400">
                  {displayModelName.toUpperCase()} PREDICTION
                </p>
                <p className="text-2xl font-serif text-stone-100 mt-1">
                  $
                  {shapData.predicted_value.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>

            <FeatureContributions
              contributions={shapForDisplay.contributions as any}
              baselineTarget={shapData.baseline_prediction}
              modelName={shapData.model_name}
            />

            <p className="text-xs text-stone-400 font-mono">
              Explanation method: {shapData.explanation_method || 'SHAP'}.
              {' '}SHAP contributions explain the model output relative to
              reference data; they do not establish causation or guarantee
              an appraisal.
            </p>
          </>
        ) : !loading && !shapError ? (
          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-12 text-center text-stone-400 font-light">
            {prediction
              ? 'Waiting for SHAP explanation data...'
              : 'Generate a property valuation first to view its SHAP explanation.'}
          </div>
        ) : null}

        <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400 font-light">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="text-stone-200 font-medium block">
                Auditable Machine Learning Standards
              </strong>
              <span>
                SHAP values measure model attribution relative to reference
                data. They are not causal effects or certified appraisals.
              </span>
            </div>
          </div>

          <Link
            to="/valuation"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition shadow-sm shadow-amber-950/30 flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adjust Inputs in Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
