export type OceanProximity = '<1H OCEAN' | 'INLAND' | 'ISLAND' | 'NEAR BAY' | 'NEAR OCEAN';

export interface HouseFeatures {
  median_income: number;
  housing_median_age: number;
  total_rooms: number;
  total_bedrooms: number;
  population: number;
  households: number;
  latitude: number;
  longitude: number;
  ocean_proximity: OceanProximity;
}

export type ModelId = 'xgboost' | 'random_forest' | 'ridge' | 'decision_tree';

export interface ModelMeta {
  id: ModelId;
  name: string;
  description: string;
  r2: number;
  rmse: number;
  mae: number;
  algorithm: string;
  training_samples: number;
}

export interface FeatureContribution {
  feature: string;
  label: string;
  user_value: number | string;
  impact_dollars: number;
  impact_pct: number;
  direction: 'positive' | 'negative';
}

export interface ModelComparisonItem {
  model_name: string;
  prediction: number;
  r2: number;
  rmse: number;
  mae: number;
}

export type MultiModelComparison = Record<string, ModelComparisonItem>;

export interface FeatureImportance {
  feature: string;
  importance: number;
  code?: string;
}

export interface PredictionResult {
  predicted_value: number;
  model_id: string;
  model_name: string;
  model_r2: number;
  model_rmse: number;
  model_mae: number;
  confidence_band: {
    low: number;
    high: number;
    margin: number;
  };
  derived_metrics: {
    rooms_per_household: number;
    bedrooms_per_room: number;
    population_per_household: number;
    price_per_room: number;
    price_per_bedroom: number;
    estimated_annual_income_usd: number;
    price_to_income_ratio: number;
  };
  benchmark_context: {
    california_median: number;
    delta_vs_ca_median_pct: number;
    ocean_proximity: OceanProximity;
    submarket_median: number;
    submarket_mean: number;
    delta_vs_submarket_pct: number;
  };
  feature_importances: Array<{ feature: string; importance: number; code?: string }>;
  contributions: FeatureContribution[];
  feature_contributions?: FeatureContribution[];
  exact_10_features?: {
    raw: Record<string, number>;
    rawArray: number[];
    scaled: Record<string, number>;
    scaledArray: number[];
  };
  explanation?: {
    model_id: string;
    model_name: string;
    baseline_prediction: number;
    disclaimer: string;
    ranked_contributions: FeatureContribution[];
  };
  multi_model_comparison: Record<string, ModelComparisonItem>;
}

export interface LocationPreset {
  id: string;
  name: string;
  county: string;
  description: string;
  values: HouseFeatures;
}

export interface OceanSubmarketStats {
  mean: number;
  median: number;
  count: number;
}

export interface IncomeTierStat {
  income_bracket: string;
  min_inc: number;
  max_inc: number;
  avg_income_usd: number;
  median_house_value: number;
  mean_house_value: number;
  sample_count: number;
}

export interface DatasetStats {
  count: number;
  mean_house_value: number;
  median_house_value: number;
  min_house_value: number;
  max_house_value: number;
  mean_income: number;
  median_income: number;
  mean_age: number;
  ocean_proximity_breakdown: Record<OceanProximity, number>;
  price_by_ocean: Record<OceanProximity, OceanSubmarketStats>;
  income_vs_value_tiers?: IncomeTierStat[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'analyst' | 'admin';
  savedCount: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SavedValuation {
  id?: string;
  userId: string;
  propertyName?: string;
  locationPreset?: string;
  oceanProximity: OceanProximity;
  latitude: number;
  longitude: number;
  medianIncome: number;
  housingMedianAge: number;
  totalRooms: number;
  totalBedrooms: number;
  population: number;
  households: number;
  modelId: string;
  modelName: string;
  modelR2: number;
  predictedValue: number;
  confidenceLow: number;
  confidenceHigh: number;
  confidenceMargin: number;
  priceToIncome: number;
  pricePerRoom: number;
  isFavorite: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

