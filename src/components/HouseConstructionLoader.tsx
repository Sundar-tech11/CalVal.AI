import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { HomeHouseLoader } from './loaders/HomeHouseLoader';
import { ValuationLoader } from './loaders/ValuationLoader';
import { MapLoader } from './loaders/MapLoader';
import { ConsensusLoader } from './loaders/ConsensusLoader';
import { AnalyticsLoader } from './loaders/AnalyticsLoader';
import { ExplainableAILoader } from './loaders/ExplainableAILoader';
import { MethodologyLoader } from './loaders/MethodologyLoader';

interface HouseConstructionLoaderProps {
  targetPath: string;
  onComplete: () => void;
}

type LoaderRouteType =
  | 'home'
  | 'valuation'
  | 'map'
  | 'consensus'
  | 'analytics'
  | 'explainable-ai'
  | 'methodology';

interface RouteLoaderConfig {
  type: LoaderRouteType;
  messages: string[];
}

function getRouteLoaderConfig(targetPath: string): RouteLoaderConfig {
  const path = targetPath.toLowerCase().trim();

  if (path === '/valuation') {
    return {
      type: 'valuation',
      messages: ['Reading property...', 'Running valuation...', 'Calculating estimate...']
    };
  }
  if (path === '/california-map') {
    return {
      type: 'map',
      messages: ['Mapping California...', 'Locating submarkets...', 'Building spatial view...']
    };
  }
  if (path === '/consensus') {
    return {
      type: 'consensus',
      messages: ['Running models...', 'Comparing predictions...', 'Building consensus...']
    };
  }
  if (path === '/analytics') {
    return {
      type: 'analytics',
      messages: ['Loading market data...', 'Analyzing trends...', 'Preparing analytics...']
    };
  }
  if (path === '/explainable-ai') {
    return {
      type: 'explainable-ai',
      messages: ['Opening the model...', 'Tracing feature influence...', 'Preparing explanation...']
    };
  }
  if (path === '/methodology') {
    return {
      type: 'methodology',
      messages: ['Loading methodology...', 'Tracing the pipeline...', 'Preparing model details...']
    };
  }

  // Default: Home (/)
  return {
    type: 'home',
    messages: ['Constructing your experience...']
  };
}

export const HouseConstructionLoader: React.FC<HouseConstructionLoaderProps> = ({
  targetPath,
  onComplete
}) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { type, messages } = getRouteLoaderConfig(targetPath);
  const [messageIndex, setMessageIndex] = useState(0);

  // Cycle through dynamic loading messages smoothly over 1.4s
  useEffect(() => {
    setMessageIndex(0);

    if (shouldReduceMotion) {
      const timer = setTimeout(onComplete, 350);
      return () => clearTimeout(timer);
    }

    const timers: NodeJS.Timeout[] = [];

    if (messages.length > 1) {
      timers.push(setTimeout(() => setMessageIndex(1), 450));
    }
    if (messages.length > 2) {
      timers.push(setTimeout(() => setMessageIndex(2), 920));
    }

    const finishTimer = setTimeout(onComplete, 1400);
    timers.push(finishTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [shouldReduceMotion, onComplete, targetPath, messages.length]);

  // Reduced motion alternative: clean minimal fade
  if (shouldReduceMotion) {
    return (
      <motion.div
        id="page-transition-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090a0d] text-center p-4"
      >
        <div className="font-serif text-sm tracking-[0.25em] text-stone-100 uppercase">
          CalVal.AI
        </div>
        <div className="text-[10px] tracking-[0.2em] font-mono text-amber-400/90 mt-1 uppercase">
          California Algorithmic Valuation
        </div>
        <div className="text-xs font-mono text-stone-400 mt-4">
          Loading page...
        </div>
      </motion.div>
    );
  }

  // Render the route-specific SVG animation
  const renderRouteAnimation = () => {
    switch (type) {
      case 'valuation':
        return <ValuationLoader />;
      case 'map':
        return <MapLoader />;
      case 'consensus':
        return <ConsensusLoader />;
      case 'analytics':
        return <AnalyticsLoader />;
      case 'explainable-ai':
        return <ExplainableAILoader />;
      case 'methodology':
        return <MethodologyLoader />;
      case 'home':
      default:
        return <HomeHouseLoader />;
    }
  };

  const currentMessage = messages[messageIndex] || messages[0] || 'Loading...';

  return (
    <motion.div
      id="page-transition-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090a0d]/98 backdrop-blur-md select-none pointer-events-auto px-4"
    >
      {/* Ambient background soft glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/[0.035] blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center max-w-lg w-full space-y-6">
        
        {/* Route-Specific Animation Container */}
        <div className="w-full flex items-center justify-center min-h-[220px]">
          {renderRouteAnimation()}
        </div>

        {/* Branding and Sequential Status Messaging */}
        <div className="flex flex-col items-center text-center space-y-2 select-none">
          <div className="space-y-1">
            <div className="font-serif text-sm sm:text-base tracking-[0.28em] text-stone-200 font-light uppercase drop-shadow-sm">
              CalVal.AI
            </div>
            <div className="text-[10px] tracking-[0.24em] font-mono text-amber-400/80 font-medium uppercase">
              California Algorithmic Valuation
            </div>
          </div>

          {/* Dynamic Sequenced Status Line */}
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentMessage}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="text-xs font-mono text-stone-400/90 tracking-wider flex items-center gap-2"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400/90 animate-pulse" />
                {currentMessage}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
