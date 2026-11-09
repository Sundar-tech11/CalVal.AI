import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Copy,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Sparkles,
  Bookmark,
  Star,
  Check,
  FolderPlus,
  Loader2,
  AlertCircle,
  ExternalLink,
  Edit2,
  CheckCheck
} from 'lucide-react';
import { PredictionResult, HouseFeatures } from '../types';
import { CountUp } from './CountUp';
import { useAuth } from '../context/AuthContext';
import { saveValuation } from '../lib/firestoreService';

export interface PredictionCardProps {
  result: PredictionResult;
  features?: HouseFeatures;
  propertyName?: string;
  locationPreset?: string;
  loading?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  result,
  features,
  propertyName,
  locationPreset,
  loading: isCalculating = false,
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lastSavedSig, setLastSavedSig] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);

  // Default property title
  const defaultTitle =
    propertyName ||
    (locationPreset
      ? `${locationPreset} Residence`
      : `${result.benchmark_context.ocean_proximity} Estate Valuation`);
  const [customTitle, setCustomTitle] = useState(defaultTitle);

  // Update default title when preset changes
  useEffect(() => {
    if (propertyName) {
      setCustomTitle(propertyName);
    } else if (locationPreset) {
      setCustomTitle(`${locationPreset} Residence`);
    }
  }, [propertyName, locationPreset]);

  // Current calculation signature to prevent duplicate saves and detect feature edits
  const currentSig = `${result.model_id}_${result.predicted_value}_${features?.latitude ?? ''}_${features?.longitude ?? ''}_${features?.median_income ?? ''}`;

  // If features or prediction changes, reset saved state for the new calculation
  useEffect(() => {
    if (lastSavedSig && lastSavedSig !== currentSig) {
      setSaved(false);
      setSavedDocId(null);
      setSaveError(null);
    }
  }, [currentSig, lastSavedSig]);

  // If user was signed out, clicked save, and now currentUser is populated, auto-save pending
  const pendingAutoSaveRef = useRef(false);
  useEffect(() => {
    if (currentUser && pendingAutoSaveRef.current) {
      pendingAutoSaveRef.current = false;
      handleSaveToPortfolio();
    }
  }, [currentUser]);

  const handleCopy = () => {
    const text = `CalVal.AI Luxury Housing Appraisal Summary
Property: ${customTitle}
Submarket: ${result.benchmark_context.ocean_proximity}
Estimated Value: $${result.predicted_value.toLocaleString()} USD
Probable Range: $${result.confidence_band.low.toLocaleString()} – $${result.confidence_band.high.toLocaleString()} (±$${result.confidence_band.margin.toLocaleString()})
Model Architecture: ${result.model_name} (R² ${result.model_r2.toFixed(2)})
Price-to-Income: ${result.derived_metrics.price_to_income_ratio}x
Valuation per Room: $${result.derived_metrics.price_per_room.toLocaleString()}`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToPortfolio = async (markFavorite = false) => {
    // If not signed in, preserve current prediction and open auth modal
    if (!currentUser) {
      pendingAutoSaveRef.current = true;
      openAuthModal('signin');
      return;
    }

    // Check for duplicate save
    if (saved && lastSavedSig === currentSig) {
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const titleToSave = customTitle.trim() || defaultTitle;
      const favoriteState = markFavorite ? true : isFavorite;

      // 9-second safeguard promise race to guarantee UI never gets permanently stuck
      const savePromise = saveValuation(currentUser.uid, {
        propertyName: titleToSave,
        locationPreset: locationPreset || undefined,
        oceanProximity: result.benchmark_context.ocean_proximity,
        latitude: Number(features?.latitude ?? 37.44),
        longitude: Number(features?.longitude ?? -122.16),
        medianIncome: Number(features?.median_income ?? 8.35),
        housingMedianAge: Number(features?.housing_median_age ?? 32),
        totalRooms: Number(features?.total_rooms ?? 2800),
        totalBedrooms: Number(features?.total_bedrooms ?? 450),
        population: Number(features?.population ?? 950),
        households: Number(features?.households ?? 420),
        modelId: result.model_id,
        modelName: result.model_name,
        modelR2: Number(result.model_r2),
        predictedValue: Number(result.predicted_value),
        confidenceLow: Number(result.confidence_band.low),
        confidenceHigh: Number(result.confidence_band.high),
        confidenceMargin: Number(result.confidence_band.margin),
        priceToIncome: Number(result.derived_metrics.price_to_income_ratio),
        pricePerRoom: Number(result.derived_metrics.price_per_room),
        isFavorite: favoriteState,
      });

      const timeoutSafeguard = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Save request timed out. Cloud Firestore server did not acknowledge the write within 9 seconds.')), 9000);
      });

      const docId = await Promise.race([savePromise, timeoutSafeguard]);

      setSaved(true);
      setSavedDocId(docId);
      setLastSavedSig(currentSig);
      if (markFavorite) setIsFavorite(true);
    } catch (err: any) {
      console.error('Failed to save valuation to Firestore:', err);
      let userMsg = 'Could not save valuation. Please check authentication and network.';
      if (err instanceof Error) {
        userMsg = err.message;
      } else if (typeof err === 'string') {
        userMsg = err;
      }

      // If JSON error structure was serialized by handleFirestoreError, extract readable description
      try {
        const parsed = JSON.parse(userMsg);
        if (parsed.error) {
          userMsg = parsed.error;
        }
      } catch {}

      if (userMsg.includes('Missing or insufficient permissions') || userMsg.includes('permission-denied')) {
        userMsg = 'Permission denied: Please ensure your user profile is registered and valid in Firestore.';
      } else if (userMsg.includes('the client is offline') || userMsg.includes('unavailable')) {
        userMsg = 'Cloud Firestore is currently unreachable or offline. Please check your internet connection or Firebase setup.';
      }

      setSaveError(userMsg);
    } finally {
      setSaving(false);
    }
  };

  const isAboveCa = result.benchmark_context.delta_vs_ca_median_pct >= 0;
  const isAboveSubmarket = result.benchmark_context.delta_vs_submarket_pct >= 0;

  return (
    <div
      id="prediction-result-card"
      data-testid="prediction-result-card"
      className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 relative overflow-hidden transition-all duration-300 group text-stone-100"
    >
      {/* Decorative luxury gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-800/90 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300 font-medium">
            Algorithmic Property Appraisal
          </span>
          <span className="text-stone-600 hidden sm:inline">•</span>
          <span className="text-xs text-stone-400 font-light hidden sm:inline">
            {result.benchmark_context.ocean_proximity} Submarket
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-stone-400 bg-stone-900/90 px-2.5 py-1 rounded-lg border border-stone-800">
            {result.model_name.split(' ')[0]} • R² <CountUp value={result.model_r2} decimals={2} duration={0.8} />
          </span>

          <button
            id="btn-copy-valuation"
            type="button"
            onClick={handleCopy}
            title="Copy appraisal summary"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white text-xs border border-stone-700/80 transition cursor-pointer hover-control-gold"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Hero Price & Probable Range */}
      <div className="mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4 relative z-10">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-mono mb-1">
            Estimated Residential Value
          </div>
          <div className="text-4xl sm:text-5xl lg:text-5xl font-serif text-stone-50 tracking-tight flex items-baseline gap-2">
            <span>
              $<CountUp value={result.predicted_value} duration={1.2} />
            </span>
            <span className="text-lg sm:text-xl font-light text-stone-400 font-sans">USD</span>
          </div>
        </div>

        {/* Probable Confidence Range Card */}
        <div className="bg-stone-950/80 border border-stone-800/90 rounded-xl p-3 text-left md:text-right hover-pill-subtle">
          <div className="text-stone-400 text-[10px] font-mono uppercase tracking-wider mb-0.5">
            Probable Valuation Range
          </div>
          <div className="font-serif text-sm sm:text-base text-amber-200 font-medium">
            $<CountUp value={result.confidence_band.low} duration={1.2} /> – $<CountUp value={result.confidence_band.high} duration={1.2} />
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
            ±$<CountUp value={result.confidence_band.margin} duration={1.0} /> model RMSE margin
          </div>
        </div>
      </div>

      {/* PRIMARY APPRAISAL ACTION BAR: SAVE TO PORTFOLIO (High-Visibility & Impossible to Miss) */}
      <div
        id="appraisal-save-panel"
        data-testid="appraisal-save-panel"
        className="mt-5 p-4 rounded-xl bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-950/90 border border-amber-500/30 shadow-lg relative z-10 space-y-3"
      >
        {/* Appraisal Nickname / Label Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-stone-400 text-[11px] uppercase font-mono tracking-wider shrink-0">
              Appraisal Label:
            </span>
            {editingTitle ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                  autoFocus
                  placeholder="e.g. Palo Alto 4-Bed Residence"
                  className="bg-stone-950 border border-amber-500/50 rounded-lg px-2 py-0.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => setEditingTitle(false)}
                  className="p-1 text-emerald-400 hover:text-emerald-300"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-medium text-stone-200 truncate">{customTitle}</span>
                <button
                  type="button"
                  onClick={() => setEditingTitle(true)}
                  title="Rename appraisal before saving"
                  className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-amber-300 transition cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Favorite Toggle Star */}
          <button
            type="button"
            onClick={() => {
              const nextFav = !isFavorite;
              setIsFavorite(nextFav);
              if (saved) {
                handleSaveToPortfolio(nextFav);
              }
            }}
            title={isFavorite ? 'Bookmarked as Favorite' : 'Mark as Favorite Property'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:text-amber-300 hover:border-amber-500/40'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-400'}`} />
            <span>{isFavorite ? 'Favorite' : 'Star'}</span>
          </button>
        </div>

        {/* Primary Action Buttons & Status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {saved ? (
            <div className="flex-1 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold tracking-wide">
                  Saved to Your Portfolio!
                </span>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-medium border border-emerald-500/40 transition"
              >
                <span>View Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <button
              id="btn-save-appraisal"
              data-testid="btn-save-appraisal"
              type="button"
              onClick={() => handleSaveToPortfolio(false)}
              disabled={saving}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 text-stone-950 text-xs sm:text-sm font-semibold tracking-wide transition shadow-lg shadow-amber-950/50 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 hover-control-gold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Saving to Portfolio...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 text-stone-950" />
                  <span>{currentUser ? 'Save Appraisal to Portfolio' : 'Sign In to Save Appraisal'}</span>
                </>
              )}
            </button>
          )}

          {/* Quick link to Dashboard if signed in */}
          {currentUser && !saved && (
            <Link
              to="/dashboard"
              className="px-3.5 py-2.5 rounded-xl bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 hover:border-amber-500/30 text-xs font-medium transition flex items-center justify-center gap-1.5 shrink-0"
              title="Open your personal portfolio dashboard"
            >
              <span>Portfolio</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </Link>
          )}
        </div>

        {/* Informational Subtext for Guests */}
        {!currentUser && (
          <p className="text-[11px] text-stone-400 font-light flex items-center gap-1.5">
            <Bookmark className="w-3 h-3 text-amber-400/80 shrink-0" />
            <span>
              Free CalVal.AI accounts let you store custom appraisals, bookmark favorites, and export valuation portfolios.
            </span>
          </p>
        )}

        {/* Error Feedback */}
        {saveError && (
          <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{saveError}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSaveToPortfolio(false)}
              className="text-[11px] font-semibold text-rose-300 hover:text-white underline cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Benchmark Metric Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-stone-800/80 relative z-10">
        <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 space-y-0.5 hover-pill-subtle">
          <div className="text-[10px] text-stone-400 font-light">vs California State</div>
          <div className={`flex items-center gap-1 font-medium text-xs sm:text-sm ${isAboveCa ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isAboveCa ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span className="font-mono">
              <CountUp value={result.benchmark_context.delta_vs_ca_median_pct} preserveSign suffix="%" decimals={0} duration={1.0} />
            </span>
          </div>
          <div className="text-[9px] text-stone-500 font-mono">State: $179.7k</div>
        </div>

        <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 space-y-0.5 hover-pill-subtle">
          <div className="text-[10px] text-stone-400 font-light">vs Submarket</div>
          <div className={`flex items-center gap-1 font-medium text-xs sm:text-sm ${isAboveSubmarket ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isAboveSubmarket ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span className="font-mono">
              <CountUp value={result.benchmark_context.delta_vs_submarket_pct} preserveSign suffix="%" decimals={0} duration={1.0} />
            </span>
          </div>
          <div className="text-[9px] text-stone-500 font-mono">
            {result.benchmark_context.ocean_proximity}: ${Math.round(result.benchmark_context.submarket_median / 1000)}k
          </div>
        </div>

        <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 space-y-0.5 hover-pill-subtle">
          <div className="text-[10px] text-stone-400 font-light">Price-to-Income</div>
          <div className="font-mono text-xs sm:text-sm text-amber-200 font-medium">
            <CountUp value={result.derived_metrics.price_to_income_ratio} decimals={1} suffix="× Multiple" duration={1.0} />
          </div>
          <div className="text-[9px] text-stone-500 font-mono">
            Inc: ${Math.round(result.derived_metrics.estimated_annual_income_usd / 1000)}k/yr
          </div>
        </div>

        <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 space-y-0.5 hover-pill-subtle">
          <div className="text-[10px] text-stone-400 font-light">Room Valuation</div>
          <div className="font-mono text-xs sm:text-sm text-stone-200 font-medium">
            $<CountUp value={result.derived_metrics.price_per_room} duration={1.1} /> / rm
          </div>
          <div className="text-[9px] text-stone-500 font-mono">
            $<CountUp value={result.derived_metrics.price_per_bedroom} duration={1.1} /> / bed
          </div>
        </div>
      </div>
    </div>
  );
};

export const PredictionResultCard = PredictionCard;
