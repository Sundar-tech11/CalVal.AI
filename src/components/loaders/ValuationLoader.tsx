import React from 'react';
import { motion } from 'motion/react';

export const ValuationLoader: React.FC = () => {
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
          <filter id="valGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="valTargetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. LUXURY ARCHITECTURAL HOUSE SILHOUETTE                  */}
        {/* ========================================================= */}
        {/* Ground Baseline */}
        <motion.line
          x1="60"
          y1="165"
          x2="380"
          y2="165"
          stroke="#f59e0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          filter="url(#valGoldGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.05 }}
        />

        {/* Central House Structure */}
        <motion.path
          d="M 155 165 L 155 116 L 220 78 L 285 116 L 285 165 Z"
          stroke="#f59e0b"
          strokeWidth="1.4"
          fill="rgba(245,158,11,0.03)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Architectural Eaves / Overhang */}
        <motion.path
          d="M 145 118 L 220 74 L 295 118"
          stroke="#fbbf24"
          strokeWidth="1.6"
          strokeLinecap="round"
          filter="url(#valGoldGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.28, delay: 0.25 }}
        />

        {/* Interior Geometry & Floor-to-Ceiling Windows */}
        <motion.rect
          x="172"
          y="124"
          width="36"
          height="41"
          stroke="#fef3c7"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          fill="rgba(254,243,199,0.03)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.38 }}
        />
        <motion.line
          x1="190"
          y1="124"
          x2="190"
          y2="165"
          stroke="#f59e0b"
          strokeWidth="0.7"
          strokeOpacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.15, delay: 0.42 }}
        />

        {/* Pivot Entrance Door */}
        <motion.rect
          x="232"
          y="120"
          width="26"
          height="45"
          stroke="#f59e0b"
          strokeWidth="0.9"
          fill="rgba(245,158,11,0.05)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.4 }}
        />
        <motion.line
          x1="251"
          y1="135"
          x2="251"
          y2="148"
          stroke="#fef3c7"
          strokeWidth="1.1"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.45 }}
        />

        {/* ========================================================= */}
        {/* 2. PROPERTY FEATURE INDICATORS (CLEAN & PURELY VISUAL)    */}
        {/* ========================================================= */}
        {/* Top-Left Feature: Income */}
        <motion.g
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.32 }}
        >
          <line x1="120" y1="84" x2="168" y2="100" stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="120" cy="84" r="2.5" fill="#f59e0b" />
          <rect x="52" y="72" width="64" height="24" rx="4" fill="#12141a" stroke="#d97706" strokeWidth="0.8" />
          <text x="84" y="87" fill="#fbbf24" fontSize="8" fontWeight="500" fontFamily="monospace" textAnchor="middle">INCOME</text>
        </motion.g>

        {/* Bottom-Left Feature: House Age */}
        <motion.g
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.44 }}
        >
          <line x1="120" y1="145" x2="155" y2="142" stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="120" cy="145" r="2.5" fill="#f59e0b" />
          <rect x="56" y="133" width="60" height="24" rx="4" fill="#12141a" stroke="#d97706" strokeWidth="0.8" />
          <text x="86" y="148" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace" textAnchor="middle">AGE</text>
        </motion.g>

        {/* Top-Right Feature: Proximity */}
        <motion.g
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.36 }}
        >
          <line x1="320" y1="84" x2="272" y2="100" stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="320" cy="84" r="2.5" fill="#f59e0b" />
          <rect x="324" y="72" width="64" height="24" rx="4" fill="#12141a" stroke="#d97706" strokeWidth="0.8" />
          <text x="356" y="87" fill="#38bdf8" fontSize="8" fontWeight="500" fontFamily="monospace" textAnchor="middle">COASTAL</text>
        </motion.g>

        {/* Bottom-Right Feature: Rooms */}
        <motion.g
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.48 }}
        >
          <line x1="320" y1="145" x2="285" y2="142" stroke="#d97706" strokeWidth="0.8" strokeDasharray="3 2" />
          <circle cx="320" cy="145" r="2.5" fill="#f59e0b" />
          <rect x="324" y="133" width="60" height="24" rx="4" fill="#12141a" stroke="#d97706" strokeWidth="0.8" />
          <text x="354" y="148" fill="#fef3c7" fontSize="8" fontWeight="500" fontFamily="monospace" textAnchor="middle">ROOMS</text>
        </motion.g>

        {/* ========================================================= */}
        {/* 3. CALCULATION SCANNER & PROGRESS INDICATOR               */}
        {/* ========================================================= */}
        <line x1="70" y1="184" x2="370" y2="184" stroke="#262322" strokeWidth="1.5" strokeLinecap="round" />
        <motion.line
          x1="70"
          y1="184"
          x2="370"
          y2="184"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#valGoldGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.85, delay: 0.2, ease: 'easeInOut' }}
        />
        {/* Scanner Laser Pulse */}
        <motion.circle
          cy="184"
          r="3"
          fill="#fef08a"
          filter="url(#valGoldGlow)"
          animate={{ cx: [70, 370] }}
          transition={{ duration: 0.85, delay: 0.2, ease: 'easeInOut' }}
        />

        {/* ========================================================= */}
        {/* 4. GLOWING VALUATION SEAL / APPRAISAL MEDALLION           */}
        {/* ========================================================= */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.32, delay: 0.92, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ originX: '220px', originY: '118px' }}
        >
          {/* Subtle Ambient Radial Glow */}
          <circle cx="220" cy="118" r="28" fill="url(#valTargetGlow)" />

          {/* Central Golden Medallion */}
          <circle
            cx="220"
            cy="118"
            r="20"
            fill="#12141a"
            stroke="#f59e0b"
            strokeWidth="1.6"
            filter="url(#valGoldGlow)"
          />
          <circle
            cx="220"
            cy="118"
            r="16"
            stroke="#fbbf24"
            strokeWidth="0.7"
            strokeDasharray="3 2"
          />

          {/* Glowing Currency Symbol */}
          <text
            x="220"
            y="125"
            fill="#fbbf24"
            fontSize="18"
            fontWeight="bold"
            fontFamily="serif"
            textAnchor="middle"
            filter="url(#valGoldGlow)"
          >
            $
          </text>
        </motion.g>
      </svg>
    </motion.div>
  );
};
