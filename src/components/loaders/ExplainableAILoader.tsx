import React from 'react';
import { motion } from 'motion/react';

export const ExplainableAILoader: React.FC = () => {
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
          <filter id="xaiGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="xaiCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. PROGRESSIVE CONNECTION LINES (Features -> Center Core) */}
        {/* ========================================================= */}
        {/* Top-Left to Center */}
        <motion.path
          d="M 120 50 Q 165 75, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: 0.32 }}
        />
        {/* Mid-Left to Center */}
        <motion.path
          d="M 115 110 L 220 110"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.38 }}
        />
        {/* Bottom-Left to Center */}
        <motion.path
          d="M 120 170 Q 165 145, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: 0.44 }}
        />

        {/* Top-Right to Center */}
        <motion.path
          d="M 320 50 Q 275 75, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: 0.48 }}
        />
        {/* Mid-Right to Center */}
        <motion.path
          d="M 325 110 L 220 110"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.54 }}
        />
        {/* Bottom-Right to Center */}
        <motion.path
          d="M 320 170 Q 275 145, 220 110"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: 0.6 }}
        />

        {/* ========================================================= */}
        {/* 2. FEATURE SIGNALS FLOW TOWARD CENTER                      */}
        {/* ========================================================= */}
        {[
          { x1: 120, y1: 50, delay: 0.62 },
          { x1: 115, y1: 110, delay: 0.66 },
          { x1: 120, y1: 170, delay: 0.70 },
          { x1: 320, y1: 50, delay: 0.74 },
          { x1: 325, y1: 110, delay: 0.78 },
          { x1: 320, y1: 170, delay: 0.82 }
        ].map((sig, i) => (
          <motion.circle
            key={`sig-${i}`}
            r="2.5"
            fill="#fef08a"
            filter="url(#xaiGoldGlow)"
            animate={{
              cx: [sig.x1, 220],
              cy: [sig.y1, 110],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 0.36, delay: sig.delay, ease: 'easeIn' }}
          />
        ))}

        {/* ========================================================= */}
        {/* 3. CENTRAL AI / MODEL NODE                                */}
        {/* ========================================================= */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.08 }}
          style={{ originX: '220px', originY: '110px' }}
        >
          <circle cx="220" cy="110" r="32" fill="url(#xaiCenterGlow)" />
          <circle cx="220" cy="110" r="23" fill="#12141a" stroke="#f59e0b" strokeWidth="1.8" filter="url(#xaiGoldGlow)" />
          <circle cx="220" cy="110" r="18" stroke="#fbbf24" strokeWidth="0.7" strokeDasharray="3 2" />
          <text x="220" y="108" fill="#fbbf24" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            SHAP
          </text>
          <text x="220" y="117" fill="#fef3c7" fontSize="6.5" fontWeight="500" fontFamily="monospace" textAnchor="middle">
            ATTRIBUTION
          </text>
        </motion.g>

        {/* ========================================================= */}
        {/* 4. SURROUNDING FEATURE NODES (PURELY VISUAL & CLEAN)      */}
        {/* ========================================================= */}
        {/* Node 1: Income */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.2 }}
        >
          <rect x="45" y="38" width="75" height="24" rx="4" fill="#12141a" stroke="#f59e0b" strokeWidth="0.9" />
          <circle cx="56" cy="50" r="2" fill="#10b981" />
          <text x="64" y="53" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace">INCOME</text>
        </motion.g>

        {/* Node 2: HouseAge */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.25 }}
        >
          <rect x="40" y="98" width="75" height="24" rx="4" fill="#12141a" stroke="#f59e0b" strokeWidth="0.9" />
          <circle cx="51" cy="110" r="2" fill="#10b981" />
          <text x="59" y="113" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace">AGE</text>
        </motion.g>

        {/* Node 3: Rooms */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.3 }}
        >
          <rect x="45" y="158" width="75" height="24" rx="4" fill="#12141a" stroke="#d97706" strokeWidth="0.9" />
          <circle cx="56" cy="170" r="2" fill="#fbbf24" />
          <text x="64" y="173" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace">ROOMS</text>
        </motion.g>

        {/* Node 4: Coastal Proximity */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.22 }}
        >
          <rect x="320" y="38" width="75" height="24" rx="4" fill="#12141a" stroke="#f59e0b" strokeWidth="0.9" />
          <circle cx="331" cy="50" r="2" fill="#38bdf8" />
          <text x="339" y="53" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace">COASTAL</text>
        </motion.g>

        {/* Node 5: Location / Latitude */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.27 }}
        >
          <rect x="325" y="98" width="75" height="24" rx="4" fill="#12141a" stroke="#f59e0b" strokeWidth="0.9" />
          <circle cx="336" cy="110" r="2" fill="#10b981" />
          <text x="344" y="113" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace">LOCATION</text>
        </motion.g>

        {/* Node 6: Density */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.32 }}
        >
          <rect x="320" y="158" width="75" height="24" rx="4" fill="#12141a" stroke="#d97706" strokeWidth="0.9" />
          <circle cx="331" cy="170" r="2" fill="#fbbf24" />
          <text x="339" y="173" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace">DENSITY</text>
        </motion.g>
      </svg>
    </motion.div>
  );
};
