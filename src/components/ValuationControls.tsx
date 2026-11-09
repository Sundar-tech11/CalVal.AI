import React from 'react';
import { Sliders, DollarSign, Home, Users, Compass, ChevronRight, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { HouseFeatures, LocationPreset, ModelId, ModelMeta, OceanProximity } from '../types';

interface ValuationControlsProps {
  features: HouseFeatures;
  onChange: (updated: Partial<HouseFeatures>) => void;
  selectedModel: ModelId;
  onSelectModel: (modelId: ModelId) => void;
  models: Record<ModelId, ModelMeta>;
  presets: LocationPreset[];
  onApplyPreset: (preset: LocationPreset) => void;
}

const OCEAN_OPTIONS: { id: OceanProximity; label: string; submarketMedian: string }[] = [
  { id: '<1H OCEAN', label: '<1 Hour Ocean', submarketMedian: '$214k' },
  { id: 'NEAR BAY', label: 'SF Bay Area', submarketMedian: '$233k' },
  { id: 'NEAR OCEAN', label: 'Coastal Pacific', submarketMedian: '$229k' },
  { id: 'INLAND', label: 'Inland Valley', submarketMedian: '$108k' },
  { id: 'ISLAND', label: 'Channel Islands', submarketMedian: '$414k' }
];

export const ValuationControls: React.FC<ValuationControlsProps> = ({
  features,
  onChange,
  selectedModel,
  onSelectModel,
  models,
  presets,
  onApplyPreset
}) => {
  const roomsPerHousehold = features.total_rooms / Math.max(features.households, 1);
  const bedroomsPerRoom = features.total_bedrooms / Math.max(features.total_rooms, 1);
  const popPerHousehold = features.population / Math.max(features.households, 1);
  const annualIncome = Math.round(features.median_income * 10000);

  return (
    <div id="prediction-form" data-testid="prediction-form" className="space-y-4">
      {/* California Market Presets Carousel */}
      <div id="market-presets-card" className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-5 shadow-lg shadow-black/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-normal text-stone-100 text-sm tracking-wide">
              California Submarket Benchmarks
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-light">Jump to representative location</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {presets.map((preset) => {
            const isMatch =
              Math.abs(preset.values.latitude - features.latitude) < 0.1 &&
              Math.abs(preset.values.longitude - features.longitude) < 0.1;

            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 border hover-pill-subtle ${
                  isMatch
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-sm shadow-amber-950/40'
                    : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-800 hover:border-amber-500/30 hover:text-white'
                }`}
              >
                <span>{preset.name.split('/')[0].trim()}</span>
                <span className="text-[10px] opacity-70 font-mono">
                  (${Math.round(preset.values.median_income * 10)}k)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div id="model-selection-card" className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-5 shadow-lg shadow-black/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-normal text-stone-100 text-sm tracking-wide">
              Predictive ML Architecture
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">16,512 census records</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {(['xgboost', 'random_forest', 'decision_tree', 'ridge'] as ModelId[]).map((mid) => {
            const meta = models[mid];
            const isSelected = selectedModel === mid;
            if (!meta) return null;

            return (
              <button
                key={mid}
                id={`model-tab-${mid}`}
                type="button"
                onClick={() => onSelectModel(mid)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between hover-pill-subtle ${
                  isSelected
                    ? 'bg-stone-900 border-amber-500/80 text-white shadow-md shadow-amber-950/30 ring-1 ring-amber-500/30'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:bg-stone-900 hover:border-amber-500/40 hover:text-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-stone-200">{meta.name.split(' ')[0]}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'
                    }`}>
                      R² {meta.r2.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 line-clamp-1 font-light">
                    {meta.algorithm}
                  </p>
                </div>
                <div className="mt-2.5 pt-1.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span>MAE: ${Math.round(meta.mae / 1000)}k</span>
                  <span>RMSE: ${Math.round(meta.rmse / 1000)}k</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Inputs and Configuration */}
      <div id="feature-sliders-card" className="bg-[#101217] border border-stone-800 hover-card-premium rounded-2xl p-5 shadow-lg shadow-black/60 space-y-5">
        {/* Ocean Proximity Radio Selector */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-stone-300 font-mono mb-2">
            Ocean Proximity Submarket
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {OCEAN_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                id={`ocean-opt-${opt.id.replace(/\s+/g, '-').replace('<', 'lt')}`}
                type="button"
                onClick={() => onChange({ ocean_proximity: opt.id })}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all duration-200 cursor-pointer hover-pill-subtle ${
                  features.ocean_proximity === opt.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm shadow-amber-950/20'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-400 hover:bg-stone-900 hover:border-amber-500/30 hover:text-stone-200'
                }`}
              >
                <div className="font-semibold text-[11px] truncate">{opt.label}</div>
                <div className="text-[10px] opacity-70 mt-0.5 font-mono">Median: {opt.submarketMedian}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 1. Median Income */}
        <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-200">
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>Median Block Income (MedInc)</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-amber-300 font-mono">
                ${annualIncome.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-400 ml-1.5 font-mono">
                ({features.median_income.toFixed(2)} × $10k)
              </span>
            </div>
          </div>
          <input
            id="slider-median-income"
            type="range"
            min="0.5"
            max="15.0"
            step="0.05"
            value={features.median_income}
            onChange={(e) => onChange({ median_income: parseFloat(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>$5k/yr (Min)</span>
            <span>$38.7k/yr (California Census Mean)</span>
            <span>$150k/yr (Max Cap)</span>
          </div>
        </div>

        {/* 2. Housing Median Age */}
        <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-200">
              <Home className="w-4 h-4 text-stone-400" />
              <span>Housing Median Age</span>
            </div>
            <span className="text-sm font-bold text-stone-100 font-mono">
              {features.housing_median_age} Years
            </span>
          </div>
          <input
            id="slider-housing-age"
            type="range"
            min="1"
            max="52"
            step="1"
            value={features.housing_median_age}
            onChange={(e) => onChange({ housing_median_age: parseInt(e.target.value, 10) })}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono">
            <span>1 Year (New Build)</span>
            <span>28.6 Years (Mean)</span>
            <span>52 Years (Established Estate)</span>
          </div>
        </div>

        {/* 3. Rooms & Bedrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">Total Rooms in Block</span>
              <span className="font-bold text-stone-200 font-mono">
                {features.total_rooms.toLocaleString()}
              </span>
            </div>
            <input
              id="slider-total-rooms"
              type="range"
              min="200"
              max="10000"
              step="50"
              value={features.total_rooms}
              onChange={(e) => {
                const total_rooms = parseInt(e.target.value, 10);
                const total_bedrooms = Math.min(features.total_bedrooms, total_rooms);
                onChange({ total_rooms, total_bedrooms });
              }}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span>Rooms per Household:</span>
              <strong className="text-stone-200 font-mono">{roomsPerHousehold.toFixed(2)}</strong>
            </div>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">Total Bedrooms</span>
              <span className="font-bold text-stone-200 font-mono">
                {features.total_bedrooms.toLocaleString()}
              </span>
            </div>
            <input
              id="slider-total-bedrooms"
              type="range"
              min="50"
              max={Math.min(features.total_rooms, 3000)}
              step="10"
              value={features.total_bedrooms}
              onChange={(e) => onChange({ total_bedrooms: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span>Bedrooms / Room Ratio:</span>
              <strong className="text-amber-300 font-mono">
                {(bedroomsPerRoom * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>

        {/* 4. Population & Households Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium text-stone-300">Block Population</span>
              </div>
              <span className="font-bold text-stone-200 font-mono">
                {features.population.toLocaleString()}
              </span>
            </div>
            <input
              id="slider-population"
              type="range"
              min="100"
              max="12000"
              step="50"
              value={features.population}
              onChange={(e) => onChange({ population: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>100</span>
              <span>1,425 (CA Mean)</span>
              <span>12,000</span>
            </div>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-300">Number of Households</span>
              <span className="font-bold text-stone-200 font-mono">
                {features.households.toLocaleString()}
              </span>
            </div>
            <input
              id="slider-households"
              type="range"
              min="50"
              max="4000"
              step="20"
              value={features.households}
              onChange={(e) => onChange({ households: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
            />
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span>Average Household Size:</span>
              <strong className="text-stone-200 font-mono">{popPerHousehold.toFixed(2)} people</strong>
            </div>
          </div>
        </div>

        {/* 5. Geographic Fine-Tuning */}
        <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="font-serif text-sm">Geographic Coordinates (Form & Map Synchronized)</span>
            </div>
            <span className="text-[11px] text-amber-300 font-mono">
              {features.latitude.toFixed(2)}°N, {Math.abs(features.longitude).toFixed(2)}°W
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Latitude (°N)</span>
                <input
                  id="input-latitude"
                  type="number"
                  min="32.5"
                  max="42.0"
                  step="0.01"
                  value={features.latitude}
                  onChange={(e) => onChange({ latitude: parseFloat(e.target.value) || 36.7 })}
                  className="w-20 bg-stone-900 border border-stone-700 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-mono text-right focus:outline-none"
                />
              </div>
              <input
                id="slider-latitude"
                type="range"
                min="32.5"
                max="42.0"
                step="0.05"
                value={features.latitude}
                onChange={(e) => onChange({ latitude: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>32.5° (San Diego)</span>
                <span>42.0° (Oregon border)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Longitude (°W)</span>
                <input
                  id="input-longitude"
                  type="number"
                  min="-124.5"
                  max="-114.0"
                  step="0.01"
                  value={features.longitude}
                  onChange={(e) => onChange({ longitude: parseFloat(e.target.value) || -119.7 })}
                  className="w-20 bg-stone-900 border border-stone-700 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-mono text-right focus:outline-none"
                />
              </div>
              <input
                id="slider-longitude"
                type="range"
                min="-124.5"
                max="-114.0"
                step="0.05"
                value={features.longitude}
                onChange={(e) => onChange({ longitude: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono">
                <span>-124.5° (Pacific Coast)</span>
                <span>-114.0° (Inland Desert)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick CTA to jump to appraisal save card */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('prediction-result-card');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              const btn = document.getElementById('btn-save-appraisal');
              if (btn) {
                btn.focus();
                btn.classList.add('ring-2', 'ring-amber-400');
                setTimeout(() => btn.classList.remove('ring-2', 'ring-amber-400'), 2000);
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-medium transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover-control-gold"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Appraisal Ready: View Valuation & Save to Portfolio</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PredictionForm = ValuationControls;
