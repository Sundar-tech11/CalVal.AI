import React, { useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, Compass, Crosshair, Sparkles } from 'lucide-react';
import { HouseFeatures, LocationPreset, OceanProximity } from '../types';

interface SpatialMapProps {
  features: HouseFeatures;
  presets: LocationPreset[];
  onSelectLocation: (lat: number, lon: number, ocean?: OceanProximity) => void;
}

// California bounding box
const LAT_MIN = 32.5;
const LAT_MAX = 42.0;
const LON_MIN = -124.5;
const LON_MAX = -114.0;

export const SpatialMap: React.FC<SpatialMapProps> = ({
  features,
  presets,
  onSelectLocation
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // SVG coordinate dimensions
  const mapWidth = 380;
  const mapHeight = 440;

  const project = useCallback((lat: number, lon: number) => {
    const xPct = (lon - LON_MIN) / (LON_MAX - LON_MIN);
    const yPct = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);

    return {
      x: Math.max(14, Math.min(mapWidth - 14, xPct * mapWidth)),
      y: Math.max(14, Math.min(mapHeight - 14, yPct * mapHeight))
    };
  }, [mapWidth, mapHeight]);

  const determineOceanProximity = (lat: number, lon: number): OceanProximity => {
    if (lat > 37.2 && lat < 38.2 && lon > -122.6 && lon < -121.9) {
      return 'NEAR BAY';
    } else if (lat < 34.0 && lon > -118.6 && lon < -118.2 && lat > 33.2) {
      return '<1H OCEAN';
    } else if (lon < -121.8 || (lat < 35.0 && lon < -117.3)) {
      return lon < -122.1 ? 'NEAR OCEAN' : '<1H OCEAN';
    } else if (lat < 34.5 && lon < -117.8) {
      return '<1H OCEAN';
    }
    return 'INLAND';
  };

  const updateFromClientCoords = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();

    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const clickY = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const scaleX = mapWidth / rect.width;
    const scaleY = mapHeight / rect.height;

    const svgX = clickX * scaleX;
    const svgY = clickY * scaleY;

    // Invert projection to get lat/lon
    const lonRaw = LON_MIN + (svgX / mapWidth) * (LON_MAX - LON_MIN);
    const latRaw = LAT_MAX - (svgY / mapHeight) * (LAT_MAX - LAT_MIN);

    const clampedLat = Math.max(LAT_MIN, Math.min(LAT_MAX, latRaw));
    const clampedLon = Math.max(LON_MIN, Math.min(LON_MAX, lonRaw));

    const lat = Math.round(clampedLat * 100) / 100;
    const lon = Math.round(clampedLon * 100) / 100;
    const ocean = determineOceanProximity(lat, lon);

    onSelectLocation(lat, lon, ocean);
  }, [onSelectLocation, mapWidth, mapHeight]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientCoords(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    updateFromClientCoords(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  const currentPos = project(features.latitude, features.longitude);

  return (
    <div id="spatial-map-card" className="bg-[#101217] border border-stone-800 rounded-2xl p-5 shadow-lg shadow-black/60 flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h3 className="font-serif font-normal text-stone-100 text-sm tracking-wide">
            California Spatial Intelligence Map
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isDragging ? (
            <span className="text-[11px] text-amber-300 font-mono bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-600/50 animate-pulse">
              Relocating marker...
            </span>
          ) : (
            <span className="text-[11px] text-stone-400 font-mono bg-stone-900/90 px-2 py-0.5 rounded-lg border border-stone-800">
              Drag or click marker
            </span>
          )}
        </div>
      </div>

      {/* Preset Location Quick-Chips */}
      {presets.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1 font-medium text-stone-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Regional Submarkets:
            </span>
            <span className="text-[10px] text-stone-400">Click to locate</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => {
              const isMatch =
                Math.abs(preset.values.latitude - features.latitude) < 0.15 &&
                Math.abs(preset.values.longitude - features.longitude) < 0.15;

              return (
                <button
                  key={preset.id}
                  id={`map-preset-btn-${preset.id}`}
                  type="button"
                  onClick={() =>
                    onSelectLocation(
                      preset.values.latitude,
                      preset.values.longitude,
                      preset.values.ocean_proximity
                    )
                  }
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium ${
                    isMatch
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-sm shadow-amber-950/40'
                      : 'bg-stone-900/70 text-stone-400 border-stone-800 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  {preset.name.split('/')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive California SVG Map Container */}
      <div className="relative w-full rounded-xl bg-[#090a0d] border border-stone-800/80 p-2 overflow-hidden select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-auto max-h-[380px] cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Subtle grid background lines */}
          <defs>
            <pattern id="cal-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1f242d" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="california-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e222a" />
              <stop offset="100%" stopColor="#12151b" />
            </linearGradient>
            <radialGradient id="pin-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid canvas background */}
          <rect width={mapWidth} height={mapHeight} fill="url(#cal-grid)" />

          {/* Approximate California Geographic Boundary Polygon */}
          <polygon
            points="
              50,15
              210,15
              210,185
              335,340
              360,390
              325,415
              290,410
              230,375
              160,320
              100,240
              70,195
              55,140
              35,70
              30,40
              50,15
            "
            fill="url(#california-fill)"
            stroke="#3a404d"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Pacific Ocean Coastal Shading Highlight */}
          <polyline
            points="
              50,15
              30,40
              35,70
              55,140
              70,195
              100,240
              160,320
              230,375
              290,410
            "
            fill="none"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />

          {/* Reference Regional Landmark Dots */}
          {presets.map((p) => {
            const pos = project(p.values.latitude, p.values.longitude);
            return (
              <g key={p.id} className="opacity-60 hover:opacity-100 transition-opacity">
                <circle cx={pos.x} cy={pos.y} r="3" fill="#78716c" />
                <text
                  x={pos.x + 6}
                  y={pos.y + 3}
                  fill="#a8a29e"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {p.name.split('/')[0].trim().slice(0, 10)}
                </text>
              </g>
            );
          })}

          {/* Active Valuation Draggable Pin Marker */}
          <g transform={`translate(${currentPos.x}, ${currentPos.y})`}>
            {/* Outer pulsating radar circle */}
            <circle cx="0" cy="0" r="18" fill="url(#pin-glow)" className="animate-pulse" />
            <circle cx="0" cy="0" r="10" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="0" cy="0" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

            {/* Target Crosshair */}
            <line x1="-12" y1="0" x2="-6" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="6" y1="0" x2="12" y2="0" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="0" y1="-12" x2="0" y2="-6" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="0" y1="6" x2="0" y2="12" stroke="#fbbf24" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Floating Coordinates readout */}
        <div className="absolute bottom-3 left-3 bg-stone-900/90 border border-stone-700/80 rounded-lg px-2.5 py-1 text-[10px] font-mono text-stone-300 shadow-md backdrop-blur-sm">
          <span>Lat: <strong className="text-amber-300">{features.latitude.toFixed(2)}°N</strong></span>
          <span className="mx-1.5 text-stone-600">|</span>
          <span>Lon: <strong className="text-amber-300">{Math.abs(features.longitude).toFixed(2)}°W</strong></span>
          <span className="mx-1.5 text-stone-600">|</span>
          <span className="text-stone-400">{features.ocean_proximity}</span>
        </div>
      </div>
    </div>
  );
};
