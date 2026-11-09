import React from 'react';
import { PredictionCard } from './PredictionCard';
import { PredictionResult, HouseFeatures } from '../types';

export interface PredictionResultCardProps {
  result: PredictionResult;
  features?: HouseFeatures;
  propertyName?: string;
  locationPreset?: string;
  loading?: boolean;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = (props) => {
  return <PredictionCard {...props} />;
};

export default PredictionResultCard;
