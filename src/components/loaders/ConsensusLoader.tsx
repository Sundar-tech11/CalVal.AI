import React from 'react';
import { motion } from 'motion/react';

export const ConsensusLoader: React.FC = () => {
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
          <filter id="conGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="conCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. SIGNAL CONDUITS TOWARD CENTRAL NODE                    */}
        {/* ========================================================= */}
        {/* Top-Left to Center */}
        <motion.path
          d="M 125 65 C 165 65, 175 110, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        />
        {/* Bottom-Left to Center */}
        <motion.path
          d="M 125 155 C 165 155, 175 110, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.46 }}
        />
        {/* Top-Right to Center */}
        <motion.path
          d="M 315 65 C 275 65, 265 110, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.52 }}
        />
        {/* Bottom-Right to Center */}
        <motion.path
          d="M 315 155 C 275 155, 265 110, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.58 }}
        />

        {/* Traveling Signal Packets */}
        <motion.circle
          r="2.5"
          fill="#fef08a"
          filter="url(#conGoldGlow)"
          animate={{
            cx: [125, 220],
            cy: [65, 110],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.42, delay: 0.65, ease: 'easeIn' }}
        />
        <motion.circle
          r="2.5"
          fill="#fef08a"
          filter="url(#conGoldGlow)"
          animate={{
            cx: [125, 220],
            cy: [155, 110],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.42, delay: 0.7, ease: 'easeIn' }}
        />
        <motion.circle
          r="2.5"
          fill="#fef08a"
          filter="url(#conGoldGlow)"
          animate={{
            cx: [315, 220],
            cy: [65, 110],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.42, delay: 0.75, ease: 'easeIn' }}
        />
        <motion.circle
          r="2.5"
          fill="#fef08a"
          filter="url(#conGoldGlow)"
          animate={{
            cx: [315, 220],
            cy: [155, 110],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 0.42, delay: 0.8, ease: 'easeIn' }}
        />

        {/* ========================================================= */}
        {/* 2. FOUR MODEL CARDS (CLEAN & PURELY ARCHITECTURAL)        */}
        {/* ========================================================= */}
        {/* Model 1: XGBoost (Top Left) */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.12 }}
        >
          <rect x="30" y="48" width="95" height="34" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#conGoldGlow)" />
          <circle cx="43" cy="65" r="2.5" fill="#10b981" />
          <text x="52" y="68" fill="#fef3c7" fontSize="8.5" fontWeight="600" fontFamily="monospace">XGBoost</text>
        </motion.g>

        {/* Model 2: Random Forest (Bottom Left) */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.25 }}
        >
          <rect x="30" y="138" width="95" height="34" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#conGoldGlow)" />
          <circle cx="43" cy="155" r="2.5" fill="#10b981" />
          <text x="52" y="158" fill="#fef3c7" fontSize="8" fontWeight="600" fontFamily="monospace">Random Forest</text>
        </motion.g>

        {/* Model 3: Decision Tree (Top Right) */}
        <motion.g
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.38 }}
        >
          <rect x="315" y="48" width="95" height="34" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#conGoldGlow)" />
          <circle cx="328" cy="65" r="2.5" fill="#10b981" />
          <text x="337" y="68" fill="#fef3c7" fontSize="8" fontWeight="600" fontFamily="monospace">Decision Tree</text>
        </motion.g>

        {/* Model 4: Ridge (Bottom Right) */}
        <motion.g
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.5 }}
        >
          <rect x="315" y="138" width="95" height="34" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#conGoldGlow)" />
          <circle cx="328" cy="155" r="2.5" fill="#10b981" />
          <text x="337" y="158" fill="#fef3c7" fontSize="8.5" fontWeight="600" fontFamily="monospace">Ridge Reg.</text>
        </motion.g>

        {/* ========================================================= */}
        {/* 3. CENTRAL CONSENSUS NODE (Convergence Symbol)            */}
        {/* ========================================================= */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.86, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ originX: '220px', originY: '110px' }}
        >
          {/* Subtle Ambient Radial Glow */}
          <circle cx="220" cy="110" r="34" fill="url(#conCenterGlow)" />

          {/* Central Consensus Emblem */}
          <circle
            cx="220"
            cy="110"
            r="26"
            fill="#12141a"
            stroke="#f59e0b"
            strokeWidth="1.6"
            filter="url(#conGoldGlow)"
          />
          <circle
            cx="220"
            cy="110"
            r="21"
            stroke="#fbbf24"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />

          <text
            x="220"
            y="108"
            fill="#f59e0b"
            fontSize="6.5"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            ENSEMBLE
          </text>
          <text
            x="220"
            y="119"
            fill="#fef08a"
            fontSize="8"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
            filter="url(#conGoldGlow)"
          >
            CONSENSUS
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
};
