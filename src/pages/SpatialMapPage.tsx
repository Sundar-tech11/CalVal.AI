import React from 'react';
import { Link } from 'react-router-dom';
import { SpatialMap } from '../components/SpatialMap';
import {
  HouseFeatures,
  LocationPreset,
  OceanProximity,
  PredictionResult
} from '../types';
import { MapPin, ArrowLeft, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { CountUp } from '../components/CountUp';

interface SpatialMapPageProps {
  features: HouseFeatures;
  presets: LocationPreset[];
  prediction: PredictionResult | null;
  onSelectLocation: (lat: number, lon: number, ocean?: OceanProximity) => void;
}

export const SpatialMapPage: React.FC<SpatialMapPageProps> = ({
  features,
  presets,
  prediction,
  onSelectLocation
}) => {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex-1 overflow-hidden">
      {/* LAYER 1: Background Photograph (Dedicated layer, z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=2400&auto=format&fit=crop"
          alt="Cinematic California Coastal Landscape and Headlands"
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
          <span className="text-amber-300 font-medium">California Location & Spatial Intelligence</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Link to="/valuation" className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Valuation</span>
          </Link>
          <span className="text-stone-600">•</span>
          <Link to="/consensus" className="text-stone-300 hover:text-amber-300 transition inline-flex items-center gap-1">
            <span>Next: Consensus</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Section 02</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-serif text-stone-50 tracking-tight">
            California Location & <span className="italic font-normal text-amber-200">Spatial Intelligence</span>
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-light mt-1 max-w-xl">
            Interact with geographic coordinates directly on the state contour. Drag the pinpoint or click any regional submarket to synchronize latitude and longitude.
          </p>
        </div>
        <div className="text-right hidden md:block text-xs font-mono text-stone-400">
          <span>Boundary: 32.5°N - 42.0°N</span>
          <span className="mx-2">•</span>
          <span className="text-amber-300">Coastline Shading</span>
        </div>
      </div>

      {/* Spatial Map Component */}
      <div className="w-full">
        <SpatialMap
          features={features}
          presets={presets}
          onSelectLocation={onSelectLocation}
        />
      </div>

      {/* Current Coordinates Valuation Banner */}
      <div className="p-6 rounded-2xl bg-stone-900/40 border border-stone-800 hover-card-premium flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-stone-400 block">Synchronized Coordinates</span>
            <h3 className="text-lg font-serif font-light text-stone-100">
              {features.latitude.toFixed(4)}°N, {Math.abs(features.longitude).toFixed(4)}°W ({features.ocean_proximity})
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {prediction && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-stone-400 block">Estimated Valuation</span>
              <span className="text-xl font-serif text-amber-300 font-light">
                <CountUp value={prediction.predicted_value} prefix="$" duration={1.2} />
              </span>
            </div>
          )}
          <Link
            to="/valuation"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide transition shadow-sm shadow-amber-950/30 flex items-center gap-2 hover-control-gold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tune in Valuation Studio</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};
