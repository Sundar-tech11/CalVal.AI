
import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BackgroundParticles } from './components/BackgroundParticles';
import { HomePage } from './pages/HomePage';
import { ValuationPage } from './pages/ValuationPage';
import { SpatialMapPage } from './pages/SpatialMapPage';
import { ConsensusPage } from './pages/ConsensusPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ExplainableAIPage } from './pages/ExplainableAIPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { HouseConstructionLoader } from './components/HouseConstructionLoader';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import {
  DatasetStats,
  HouseFeatures,
  LocationPreset,
  ModelId,
  ModelMeta,
  OceanProximity,
  PredictionResult
} from './types';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const INITIAL_FEATURES: HouseFeatures = {
  median_income: 8.35,
  housing_median_age: 32.0,
  total_rooms: 2800.0,
  total_bedrooms: 450.0,
  population: 950.0,
  households: 420.0,
  latitude: 37.44,
  longitude: -122.16,
  ocean_proximity: 'NEAR BAY'
};

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  return null;
}

function MainAppContent() {
  const predictionRequestId = React.useRef(0);
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const [features, setFeatures] = useState<HouseFeatures>(INITIAL_FEATURES);
  const [selectedModel, setSelectedModel] = useState<ModelId>('xgboost');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [presets, setPresets] = useState<LocationPreset[]>([]);
  const [models, setModels] = useState<Record<ModelId, ModelMeta>>({} as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track route switching to trigger the house construction loading animation.
  const isInitialMount = useRef(true);
  const prevPathRef = useRef(location.pathname);
  const [transitioningTo, setTransitioningTo] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname;
      setTransitioningTo(location.pathname);
    }
  }, [location.pathname]);

  const handleTransitionComplete = useCallback(() => {
    setTransitioningTo(null);
  }, []);

  // Load initial dataset stats and presets from the backend.
  useEffect(() => {
    fetch('/api/dataset-stats')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.presets) setPresets(data.presets);
        if (data.models) setModels(data.models);
      })
      .catch((err) => {
        console.warn('Could not fetch dataset stats:', err);
      });
  }, []);

  // Compute prediction whenever features or the selected model changes.
  const runPrediction = useCallback(async () => {
    const requestId = ++predictionRequestId.current;

    try {
      setLoading(true);
      setError(null);

      const aveRooms =
        features.total_rooms / Math.max(features.households, 1);
      const aveBedrms =
        features.total_bedrooms / Math.max(features.households, 1);
      const aveOccup =
        features.population / Math.max(features.households, 1);

      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...features,
          MedInc: features.median_income,
          HouseAge: features.housing_median_age,
          AveRooms: aveRooms,
          AveBedrms: aveBedrms,
          Population: features.population,
          AveOccup: aveOccup,
          Latitude: features.latitude,
          Longitude: features.longitude,
          model_id: selectedModel
        })
      });

      if (requestId !== predictionRequestId.current) return;

      if (res.ok) {
        const data = await res.json();

        if (requestId !== predictionRequestId.current) return;

        setPrediction(data);
        setError(null);
      } else {
        const errJson = await res.json().catch(() => ({}));

        if (requestId !== predictionRequestId.current) return;

        setError(
          errJson.error || `Valuation failed with status ${res.status}`
        );
      }
    } catch (err: any) {
      if (requestId !== predictionRequestId.current) return;

      console.error('Failed to compute prediction:', err);
      setError(err?.message || 'Network error connecting to valuation service');
    } finally {
      if (requestId === predictionRequestId.current) {
        setLoading(false);
      }
    }
  }, [features, selectedModel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      runPrediction();
    }, 600);

    return () => clearTimeout(timer);
  }, [runPrediction]);

  const handleFeatureChange = (updated: Partial<HouseFeatures>) => {
    setFeatures((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectLocation = (
    lat: number,
    lon: number,
    ocean?: OceanProximity
  ) => {
    setFeatures((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      ...(ocean ? { ocean_proximity: ocean } : {})
    }));
  };

  const handleApplyPreset = (preset: LocationPreset) => {
    setFeatures({ ...preset.values });
  };

  const handleReset = () => {
    setFeatures(INITIAL_FEATURES);
    setSelectedModel('xgboost');
  };

  const activeModelMeta = models[selectedModel] || null;

  return (
    <div
      id="calval-app-root"
      className="min-h-screen bg-[#0b0d11] text-stone-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200 relative"
    >
      {/* Authentication Modal */}
      <AuthModal />

      {/* Route-Switching House Construction Loading Transition */}
      <AnimatePresence mode="wait">
        {transitioningTo && (
          <HouseConstructionLoader
            key="house-construction-transition-loader"
            targetPath={transitioningTo}
            onComplete={handleTransitionComplete}
          />
        )}
      </AnimatePresence>

      {/* Subtle Background Particles */}
      <BackgroundParticles />

      {/* Header */}
      <Header
        stats={stats}
        activeModel={activeModelMeta}
        onReset={handleReset}
      />

      {/* Error Alert Banner */}
      {error && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            id="error-banner"
            role="alert"
            className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 flex items-center justify-between gap-3 text-xs shadow-lg shadow-rose-950/40"
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <strong className="font-semibold block">
                  Valuation Engine Notice:
                </strong>
                <span>{error}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={runPrediction}
              className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-600 text-rose-100 cursor-pointer transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Routed Page Content with Premium Page Transition */}
      <main className="flex-1 w-full pb-16 overflow-x-hidden flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }
            }
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.25,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full flex-1 flex flex-col"
          >
            <ScrollToTop />

            <Routes location={location}>
              <Route
                path="/"
                element={
                  <HomePage
                    features={features}
                    presets={presets}
                    prediction={prediction}
                    stats={stats}
                    selectedModel={selectedModel}
                    models={models}
                    onApplyPreset={handleApplyPreset}
                    onQuickEstimate={handleFeatureChange}
                    onNavigateToValuation={() => navigate('/valuation')}
                  />
                }
              />

              <Route
                path="/valuation"
                element={
                  <ValuationPage
                    features={features}
                    selectedModel={selectedModel}
                    models={models}
                    presets={presets}
                    prediction={prediction}
                    onChange={handleFeatureChange}
                    onSelectModel={setSelectedModel}
                    onApplyPreset={handleApplyPreset}
                  />
                }
              />

              <Route
                path="/california-map"
                element={
                  <SpatialMapPage
                    features={features}
                    presets={presets}
                    prediction={prediction}
                    onSelectLocation={handleSelectLocation}
                  />
                }
              />

              <Route
                path="/consensus"
                element={
                  <ConsensusPage
                    prediction={prediction}
                    selectedModel={selectedModel}
                    onSelectModel={setSelectedModel}
                  />
                }
              />

              <Route
                path="/analytics"
                element={
                  <AnalyticsPage
                    stats={stats}
                    prediction={prediction}
                    models={models}
                    selectedModel={selectedModel}
                    currentIncome={features.median_income}
                  />
                }
              />

              <Route
                path="/explainable-ai"
                element={
                  <ExplainableAIPage
                    prediction={prediction}
                    stats={stats}
                    features={features}
                    selectedModel={selectedModel}
                  />
                }
              />

              <Route
                path="/methodology"
                element={<MethodologyPage />}
              />

              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    onLoadValuationFeatures={handleFeatureChange}
                  />
                }
              />

              <Route
                path="/profile"
                element={<ProfilePage />}
              />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
