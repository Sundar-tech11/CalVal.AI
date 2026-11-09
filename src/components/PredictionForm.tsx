import React from 'react';
import { ValuationControls } from './ValuationControls';
import { HouseFeatures, LocationPreset, ModelId, ModelMeta } from '../types';

export interface PredictionFormProps {
  features: HouseFeatures;
  onChange: (updated: Partial<HouseFeatures>) => void;
  selectedModel: ModelId;
  onSelectModel: (modelId: ModelId) => void;
  models: Record<ModelId, ModelMeta>;
  presets: LocationPreset[];
  onApplyPreset: (preset: LocationPreset) => void;
  onSubmit?: () => void;
  loading?: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = (props) => {
  return <ValuationControls {...props} />;
};

export default PredictionForm;
