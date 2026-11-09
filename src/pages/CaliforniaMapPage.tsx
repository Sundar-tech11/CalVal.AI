import React from 'react';
import { Link } from 'react-router-dom';
import { SpatialMap } from '../components/SpatialMap';
import { HouseFeatures, LocationPreset, OceanProximity } from '../types';
import { ArrowLeft, MapPin } from 'lucide-react';

interface CaliforniaMapPageProps {
  features: HouseFeatures;
  presets: LocationPreset[];
  onSelectLocation: (lat: number, lon: number, ocean?: OceanProximity) => void;
}

export const CaliforniaMapPage: React.FC<CaliforniaMapPageProps> = ({
  features,
  presets,
  onSelectLocation
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <span>Route:</span>
          <span className="text-amber-300">/california-map</span>
        </div>
      </div>

      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Studio 02</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-serif text-stone-50 tracking-tight">
            California Location & <span className="italic font-normal text-amber-200">Spatial Intelligence</span>
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light mt-1 max-w-xl">
            Interact with geographic coordinates directly on the state contour. Drag the pinpoint or click any regional submarket to synchronize latitude and longitude.
          </p>
        </div>
        <div className="text-right hidden md:block text-xs font-mono text-stone-400">
          <span>Boundary: 32.5°N - 42.0°N</span>
          <span className="mx-2">•</span>
          <span className="text-amber-300">Coastline Shading</span>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="w-full">
        <SpatialMap
          features={features}
          presets={presets}
          onSelectLocation={onSelectLocation}
        />
      </div>
    </div>
  );
};
