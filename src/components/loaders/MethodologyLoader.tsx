import React from 'react';
import { motion } from 'motion/react';

export const MethodologyLoader: React.FC = () => {
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
          <filter id="methGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="methPredGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. PIPELINE CONDUIT TRACK LINE                            */}
        {/* ========================================================= */}
        <line x1="45" y1="110" x2="395" y2="110" stroke="#262322" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Connecting Arrows Between Stages */}
        {[
          { x1: 82, x2: 104, delay: 0.25 },
          { x1: 168, x2: 190, delay: 0.43 },
          { x1: 254, x2: 276, delay: 0.61 },
          { x1: 340, x2: 362, delay: 0.79 }
        ].map((arrow, i) => (
          <motion.g
            key={`arrow-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: arrow.delay }}
          >
            <line x1={arrow.x1} y1="110" x2={arrow.x2} y2="110" stroke="#f59e0b" strokeWidth="1.3" />
            <polygon
              points={`${arrow.x2},110 ${arrow.x2 - 4},107 ${arrow.x2 - 4},113`}
              fill="#fbbf24"
            />
          </motion.g>
        ))}

        {/* ========================================================= */}
        {/* 2. FIVE SEQUENTIAL PIPELINE STAGE BLOCKS                  */}
        {/* ========================================================= */}
        {/* Stage 1: DATA */}
        <motion.g
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.1, ease: 'easeOut' }}
          style={{ originX: '52px', originY: '110px' }}
        >
          <rect x="22" y="85" width="60" height="50" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#methGoldGlow)" />
          {/* Database Cylinders */}
          <ellipse cx="52" cy="98" rx="9" ry="2.8" fill="#262322" stroke="#d97706" strokeWidth="0.8" />
          <path d="M 43 98 L 43 105 A 9 2.8 0 0 0 61 105 L 61 98" fill="none" stroke="#d97706" strokeWidth="0.8" />
          <text x="52" y="122" fill="#fbbf24" fontSize="7.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">
            DATA
          </text>
        </motion.g>

        {/* Stage 2: PREPROCESS */}
        <motion.g
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.28, ease: 'easeOut' }}
          style={{ originX: '136px', originY: '110px' }}
        >
          <rect x="106" y="85" width="60" height="50" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#methGoldGlow)" />
          {/* Filter Geometry */}
          <polygon points="128,96 144,96 139,103 139,107 133,107 133,103" stroke="#d97706" strokeWidth="0.8" fill="none" />
          <text x="136" y="122" fill="#fbbf24" fontSize="6.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">
            PREPROC
          </text>
        </motion.g>

        {/* Stage 3: FEATURES */}
        <motion.g
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.46, ease: 'easeOut' }}
          style={{ originX: '222px', originY: '110px' }}
        >
          <rect x="192" y="85" width="60" height="50" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#methGoldGlow)" />
          {/* Sliders */}
          <line x1="208" y1="97" x2="236" y2="97" stroke="#78716c" strokeWidth="0.9" />
          <circle cx="218" cy="97" r="2.2" fill="#f59e0b" />
          <line x1="208" y1="104" x2="236" y2="104" stroke="#78716c" strokeWidth="0.9" />
          <circle cx="228" cy="104" r="2.2" fill="#f59e0b" />
          <text x="222" y="122" fill="#fbbf24" fontSize="6.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">
            FEATURES
          </text>
        </motion.g>

        {/* Stage 4: MODEL */}
        <motion.g
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.64, ease: 'easeOut' }}
          style={{ originX: '308px', originY: '110px' }}
        >
          <rect x="278" y="85" width="60" height="50" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1" filter="url(#methGoldGlow)" />
          {/* Neural / Decision Nodes */}
          <circle cx="308" cy="96" r="2" fill="#fbbf24" />
          <circle cx="298" cy="104" r="2" fill="#fbbf24" />
          <circle cx="318" cy="104" r="2" fill="#fbbf24" />
          <line x1="308" y1="96" x2="298" y2="104" stroke="#d97706" strokeWidth="0.7" />
          <line x1="308" y1="96" x2="318" y2="104" stroke="#d97706" strokeWidth="0.7" />
          <text x="308" y="122" fill="#fbbf24" fontSize="7.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">
            MODEL
          </text>
        </motion.g>

        {/* Stage 5: PREDICTION */}
        <motion.g
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.82, ease: 'easeOut' }}
          style={{ originX: '394px', originY: '110px' }}
        >
          <rect x="364" y="85" width="60" height="50" rx="5" fill="#12141a" stroke="#f59e0b" strokeWidth="1.2" filter="url(#methGoldGlow)" />
          <text x="394" y="103" fill="#fef08a" fontSize="10" fontWeight="bold" fontFamily="serif" textAnchor="middle">
            $
          </text>
          <text x="394" y="122" fill="#10b981" fontSize="6.5" fontWeight="600" fontFamily="monospace" textAnchor="middle">
            PREDICT
          </text>
        </motion.g>

        {/* ========================================================= */}
        {/* 3. GLOWING SIGNAL PACKET TRAVELING THROUGH PIPELINE       */}
        {/* ========================================================= */}
        <motion.circle
          cy="110"
          r="3.5"
          fill="#fef08a"
          filter="url(#methGoldGlow)"
          animate={{
            cx: [52, 136, 222, 308, 394],
            scale: [1, 1.15, 1, 1.15, 1.4]
          }}
          transition={{ duration: 0.85, delay: 0.18, ease: 'easeInOut' }}
        />

        {/* Final Prediction Bloom Halo */}
        <motion.circle
          cx="394"
          cy="110"
          r="26"
          fill="url(#methPredGlow)"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.75, 0.4], scale: [0.4, 1.15, 1] }}
          transition={{ duration: 0.35, delay: 0.95, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
};
