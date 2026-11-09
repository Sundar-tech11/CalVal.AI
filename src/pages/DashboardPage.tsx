import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  DollarSign,
  Star,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listenUserValuations, toggleFavoriteValuation, deleteValuation } from '../lib/firestoreService';
import { SavedValuation, HouseFeatures, OceanProximity } from '../types';

interface DashboardPageProps {
  onLoadValuationFeatures?: (features: HouseFeatures) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLoadValuationFeatures }) => {
  const { currentUser, userProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [valuations, setValuations] = useState<SavedValuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubmarket, setFilterSubmarket] = useState<string>('ALL');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = listenUserValuations(
      currentUser.uid,
      (records) => {
        setValuations(records);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to stream valuations:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Aggregate Portfolio Metrics
  const metrics = useMemo(() => {
    const totalCount = valuations.length;
    const totalValue = valuations.reduce((acc, curr) => acc + (curr.predictedValue || 0), 0);
    const avgValue = totalCount > 0 ? Math.round(totalValue / totalCount) : 0;
    const favoritesCount = valuations.filter((v) => v.isFavorite).length;

    return { totalCount, totalValue, avgValue, favoritesCount };
  }, [valuations]);

  // Filtered Valuations
  const filteredValuations = useMemo(() => {
    return valuations.filter((v) => {
      if (favoritesOnly && !v.isFavorite) return false;
      if (filterSubmarket !== 'ALL' && v.oceanProximity !== filterSubmarket) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = v.propertyName?.toLowerCase().includes(q);
        const matchesPreset = v.locationPreset?.toLowerCase().includes(q);
        const matchesOcean = v.oceanProximity?.toLowerCase().includes(q);
        const matchesModel = v.modelName?.toLowerCase().includes(q);
        if (!matchesName && !matchesPreset && !matchesOcean && !matchesModel) return false;
      }
      return true;
    });
  }, [valuations, searchQuery, filterSubmarket, favoritesOnly]);

  const handleToggleFavorite = async (v: SavedValuation) => {
    if (!currentUser || !v.id) return;
    try {
      await toggleFavoriteValuation(currentUser.uid, v.id, !!v.isFavorite);
      showNotice(v.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleDelete = async (v: SavedValuation) => {
    if (!currentUser || !v.id) return;
    try {
      await deleteValuation(currentUser.uid, v.id, !!v.isFavorite);
      setDeleteConfirmId(null);
      showNotice('Valuation record deleted');
    } catch (err) {
      console.error('Failed to delete valuation:', err);
    }
  };

  const handleLoadIntoEngine = (v: SavedValuation) => {
    if (onLoadValuationFeatures) {
      onLoadValuationFeatures({
        median_income: v.medianIncome,
        housing_median_age: v.housingMedianAge,
        total_rooms: v.totalRooms,
        total_bedrooms: v.totalBedrooms,
        population: v.population,
        households: v.households,
        latitude: v.latitude,
        longitude: v.longitude,
        ocean_proximity: v.oceanProximity,
      });
    }
    navigate('/valuation');
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(valuations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `calval_portfolio_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    if (valuations.length === 0) return;
    const headers = [
      'Property Name',
      'Location Preset',
      'Submarket',
      'Latitude',
      'Longitude',
      'Median Income',
      'Estimated Value USD',
      'Range Low',
      'Range High',
      'Model',
      'Model R2',
      'Date Saved'
    ];

    const rows = valuations.map((v) => [
      `"${v.propertyName || 'Appraisal'}"`,
      `"${v.locationPreset || ''}"`,
      `"${v.oceanProximity}"`,
      v.latitude,
      v.longitude,
      v.medianIncome,
      v.predictedValue,
      v.confidenceLow,
      v.confidenceHigh,
      `"${v.modelName}"`,
      v.modelR2,
      `"${v.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `calval_appraisals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-[#101217] border border-stone-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-amber-500/40 p-3 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-amber-950/30">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-serif text-stone-50 font-normal">Investor Portfolio Dashboard</h2>
          <p className="text-xs text-stone-400 font-light mt-2 mb-6">
            Sign in to access your personal California real estate valuations, track portfolio metrics, and export appraisal dossiers.
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold tracking-wide transition shadow-md shadow-amber-950/40 cursor-pointer hover-control-gold"
            >
              Sign In to Your Account
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs border border-stone-800 hover:border-amber-500/40 transition cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-page" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-stone-900/95 border border-amber-500/60 text-stone-100 text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              Institutional Portfolio
            </span>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-400 font-mono">
              {currentUser.email}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-stone-50 font-normal tracking-tight">
            Investor Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-light mt-1">
            Manage your saved California property valuations, comparative market analyses, and model predictions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/valuation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-semibold tracking-wide transition shadow-md shadow-amber-950/40 cursor-pointer hover-control-gold"
          >
            <Plus className="w-4 h-4" />
            <span>New Valuation</span>
          </Link>
          <button
            type="button"
            onClick={exportCSV}
            disabled={valuations.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs border border-stone-800 hover:border-stone-700 transition cursor-pointer disabled:opacity-40"
            title="Export valuations to CSV"
          >
            <Download className="w-3.5 h-3.5 text-stone-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101217] border border-stone-800/90 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-[11px]">Saved Valuations</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif text-stone-50 tracking-tight">
            {metrics.totalCount}
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-1">
            {metrics.favoritesCount} favorited
          </div>
        </div>

        <div className="bg-[#101217] border border-stone-800/90 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-[11px]">Portfolio Total</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif text-stone-50 tracking-tight">
            ${(metrics.totalValue / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-400/80 font-mono mt-1">
            Combined Estimated Value
          </div>
        </div>

        <div className="bg-[#101217] border border-stone-800/90 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-[11px]">Average Valuation</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif text-amber-200 tracking-tight">
            ${(metrics.avgValue / 1_000).toFixed(0)}k
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-1">
            Across saved tracts
          </div>
        </div>

        <div className="bg-[#101217] border border-stone-800/90 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
            <span className="font-mono uppercase tracking-wider text-[11px]">Favorites</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="text-3xl font-serif text-stone-50 tracking-tight">
            {metrics.favoritesCount}
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-1">
            Priority properties
          </div>
        </div>
      </div>

      {/* Filters and Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#101217]/70 border border-stone-800/80 rounded-2xl p-3.5 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by preset, submarket, or model..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-900/80 border border-stone-800 rounded-xl text-stone-100 text-xs placeholder:text-stone-600 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={filterSubmarket}
            onChange={(e) => setFilterSubmarket(e.target.value)}
            className="bg-stone-900 border border-stone-800 rounded-xl text-stone-300 text-xs px-3 py-1.5 focus:outline-none focus:border-amber-500/60"
          >
            <option value="ALL">All Submarkets</option>
            <option value="<1H OCEAN">&lt;1H Ocean</option>
            <option value="INLAND">Inland</option>
            <option value="NEAR BAY">Near Bay</option>
            <option value="NEAR OCEAN">Near Ocean</option>
            <option value="ISLAND">Island</option>
          </select>

          <button
            type="button"
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition cursor-pointer ${
              favoritesOnly
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Valuations Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-400 font-mono">Loading saved portfolio records...</p>
        </div>
      ) : filteredValuations.length === 0 ? (
        <div className="bg-[#101217] border border-stone-800/80 rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-stone-600 mx-auto mb-3" />
          <h3 className="text-lg font-serif text-stone-200">
            {searchQuery || favoritesOnly || filterSubmarket !== 'ALL'
              ? 'No matching valuations found'
              : 'No saved property valuations yet'}
          </h3>
          <p className="text-xs text-stone-400 font-light max-w-md mx-auto mt-1 mb-6">
            {searchQuery || favoritesOnly || filterSubmarket !== 'ALL'
              ? 'Try adjusting your search criteria or submarket filter.'
              : 'Estimate any California property and click "Save Appraisal" to start building your portfolio.'}
          </p>
          <Link
            to="/valuation"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition shadow-md shadow-amber-950/40 cursor-pointer hover-control-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Valuation Engine</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredValuations.map((v) => (
            <div
              key={v.id}
              className="bg-[#101217] border border-stone-800/90 hover:border-amber-500/40 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition" />

              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300">
                        {v.oceanProximity}
                      </span>
                      {v.locationPreset && (
                        <span className="text-[11px] text-stone-400 font-mono">
                          {v.locationPreset}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-stone-100 mt-1 line-clamp-1">
                      {v.propertyName || v.locationPreset || `California Tract (${v.latitude.toFixed(2)}, ${v.longitude.toFixed(2)})`}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(v)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-amber-400 transition cursor-pointer"
                    title={v.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        v.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-600 hover:text-amber-300'
                      }`}
                    />
                  </button>
                </div>

                {/* Big Price Display */}
                <div className="my-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                    Appraisal Value
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif text-stone-50 tracking-tight">
                    ${v.predictedValue?.toLocaleString()} USD
                  </div>
                  <div className="text-[11px] text-amber-200/90 font-mono mt-0.5">
                    Range: ${v.confidenceLow?.toLocaleString()} – ${v.confidenceHigh?.toLocaleString()}
                  </div>
                </div>

                {/* Specs pill badges */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-800/60 text-[11px] text-stone-300">
                  <div className="bg-stone-950/60 p-2 rounded-lg border border-stone-800/60 text-center">
                    <div className="text-[9px] text-stone-500 uppercase font-mono">Income</div>
                    <div className="font-mono text-amber-200 font-medium">
                      ${Math.round(v.medianIncome * 10)}k
                    </div>
                  </div>
                  <div className="bg-stone-950/60 p-2 rounded-lg border border-stone-800/60 text-center">
                    <div className="text-[9px] text-stone-500 uppercase font-mono">House Age</div>
                    <div className="font-mono text-stone-200 font-medium">{v.housingMedianAge} yrs</div>
                  </div>
                  <div className="bg-stone-950/60 p-2 rounded-lg border border-stone-800/60 text-center">
                    <div className="text-[9px] text-stone-500 uppercase font-mono">Rooms</div>
                    <div className="font-mono text-stone-200 font-medium">{v.totalRooms}</div>
                  </div>
                </div>

                {/* Model tag and date */}
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mt-3">
                  <span>{v.modelName} (R² {v.modelR2?.toFixed(2)})</span>
                  <span>{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ''}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadIntoEngine(v)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs border border-stone-800 hover:border-amber-500/40 transition cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect in Valuation</span>
                </button>

                {deleteConfirmId === v.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(v)}
                      className="px-2 py-1.5 rounded-lg bg-rose-950 border border-rose-600 text-rose-200 text-xs cursor-pointer hover:bg-rose-900"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1.5 rounded-lg bg-stone-900 text-stone-400 text-xs cursor-pointer hover:bg-stone-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(v.id || null)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 border border-transparent hover:border-rose-900/60 transition cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
