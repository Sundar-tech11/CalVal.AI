import React from 'react';
import { motion } from 'motion/react';

export const HomeHouseLoader: React.FC = () => {
  return (
    <motion.div
      animate={{
        scale: [1, 1, 1.012, 1],
        opacity: [0.95, 1, 1, 0.98]
      }}
      transition={{ duration: 1.4, times: [0, 0.8, 0.95, 1], ease: 'easeOut' }}
      className="w-full flex items-center justify-center"
    >
      <svg
        viewBox="0 0 440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[340px] sm:max-w-[400px] h-auto overflow-visible"
      >
        <defs>
          <filter id="homeGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="homeInteriorWarmth" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.1" />
          </radialGradient>

          <radialGradient id="homeSconceWarmth" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Ground & Foundation Line */}
        <motion.line
          x1="40"
          y1="180"
          x2="400"
          y2="180"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#homeGoldGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* 2. Foundation / Plinth Base */}
        <motion.path
          d="M 65 180 L 65 174 L 375 174 L 375 180"
          stroke="#d97706"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.25, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.line
          x1="186"
          y1="177"
          x2="244"
          y2="177"
          stroke="#fef3c7"
          strokeWidth="0.9"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.2, delay: 0.26 }}
        />

        {/* 3. Exterior Walls & Columns */}
        <motion.line
          x1="75"
          y1="174"
          x2="75"
          y2="120"
          stroke="#f59e0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.3, ease: 'easeOut' }}
        />
        <motion.line
          x1="195"
          y1="174"
          x2="195"
          y2="120"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.33, ease: 'easeOut' }}
        />
        <motion.line
          x1="235"
          y1="174"
          x2="235"
          y2="120"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.35, ease: 'easeOut' }}
        />
        <motion.line
          x1="365"
          y1="174"
          x2="365"
          y2="120"
          stroke="#f59e0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.38, ease: 'easeOut' }}
        />

        {/* Level 2 Cantilever Volume Walls */}
        <motion.line
          x1="100"
          y1="120"
          x2="100"
          y2="66"
          stroke="#fbbf24"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.45, ease: 'easeOut' }}
        />
        <motion.line
          x1="220"
          y1="120"
          x2="220"
          y2="66"
          stroke="#d97706"
          strokeWidth="1.1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.24, delay: 0.48, ease: 'easeOut' }}
        />
        <motion.line
          x1="340"
          y1="120"
          x2="340"
          y2="66"
          stroke="#fbbf24"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.52, ease: 'easeOut' }}
        />

        {/* Mid-level Cantilever Floor Slab */}
        <motion.path
          d="M 65 120 L 375 120"
          stroke="#f59e0b"
          strokeWidth="1.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* 4. Windows, Doors & Interior Warm Glow */}
        <motion.rect
          x="85"
          y="126"
          width="45"
          height="42"
          fill="url(#homeInteriorWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.35, delay: 0.94 }}
        />
        <motion.rect
          x="140"
          y="126"
          width="45"
          height="42"
          fill="url(#homeInteriorWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.35, delay: 0.96 }}
        />
        <motion.rect
          x="245"
          y="130"
          width="45"
          height="38"
          fill="url(#homeInteriorWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.35, delay: 0.98 }}
        />
        <motion.rect
          x="300"
          y="130"
          width="48"
          height="38"
          fill="url(#homeInteriorWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.35, delay: 1.0 }}
        />
        <motion.rect
          x="110"
          y="74"
          width="96"
          height="32"
          fill="url(#homeInteriorWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 0.35, delay: 1.02 }}
        />
        <motion.rect
          x="230"
          y="74"
          width="55"
          height="38"
          fill="url(#homeInteriorWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.35, delay: 1.04 }}
        />

        {/* Window & Door Frames */}
        <motion.rect
          x="85"
          y="126"
          width="45"
          height="42"
          stroke="#fef3c7"
          strokeWidth="0.8"
          strokeOpacity="0.7"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, delay: 0.7 }}
        />
        <motion.rect
          x="140"
          y="126"
          width="45"
          height="42"
          stroke="#fef3c7"
          strokeWidth="0.8"
          strokeOpacity="0.7"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, delay: 0.72 }}
        />

        {/* Front Door */}
        <motion.rect
          x="202"
          y="128"
          width="26"
          height="46"
          stroke="#f59e0b"
          strokeWidth="1.1"
          fill="rgba(245,158,11,0.06)"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          style={{ originY: 1 }}
          transition={{ duration: 0.24, delay: 0.72 }}
        />
        <motion.line
          x1="223"
          y1="145"
          x2="223"
          y2="159"
          stroke="#fef3c7"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, delay: 0.8 }}
        />

        <motion.rect
          x="245"
          y="130"
          width="45"
          height="38"
          stroke="#fef3c7"
          strokeWidth="0.8"
          strokeOpacity="0.7"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, delay: 0.74 }}
        />
        <motion.rect
          x="300"
          y="130"
          width="48"
          height="38"
          stroke="#fef3c7"
          strokeWidth="0.8"
          strokeOpacity="0.7"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22, delay: 0.76 }}
        />

        <motion.rect
          x="110"
          y="74"
          width="96"
          height="32"
          stroke="#fef3c7"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, delay: 0.76 }}
        />

        {/* 5. Cantilevered Roof & Canopy */}
        <motion.path
          d="M 85 60 L 355 60 L 355 66 L 85 66 Z"
          stroke="#f59e0b"
          strokeWidth="1.3"
          fill="rgba(245,158,11,0.1)"
          filter="url(#homeGoldGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 190 116 L 244 116 L 244 120 L 190 120 Z"
          stroke="#fbbf24"
          strokeWidth="1.1"
          fill="rgba(251,191,36,0.12)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.22, delay: 0.65 }}
        />

        {/* 6. Architectural Details & Minimalist Louvers */}
        <motion.line
          x1="220"
          y1="104"
          x2="340"
          y2="104"
          stroke="#fef3c7"
          strokeWidth="0.9"
          strokeOpacity="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.24, delay: 0.85 }}
        />
        {[245, 275, 305, 335].map((x, i) => (
          <motion.line
            key={`stanchion-${x}`}
            x1={x}
            y1="104"
            x2={x}
            y2="120"
            stroke="#d97706"
            strokeWidth="0.7"
            strokeOpacity="0.6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.88 + i * 0.02 }}
          />
        ))}

        {[300, 310, 320, 330].map((x, i) => (
          <motion.line
            key={`slat-${x}`}
            x1={x}
            y1="70"
            x2={x}
            y2="98"
            stroke="#f59e0b"
            strokeWidth="0.9"
            strokeOpacity="0.7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.22, delay: 0.86 + i * 0.03 }}
          />
        ))}

        {/* Sconce light */}
        <motion.circle
          cx="198"
          cy="146"
          r="1.8"
          fill="#fef3c7"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.94 }}
        />
        <motion.circle
          cx="198"
          cy="146"
          r="8"
          fill="url(#homeSconceWarmth)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.3, delay: 0.98 }}
        />
      </svg>
    </motion.div>
  );
};
