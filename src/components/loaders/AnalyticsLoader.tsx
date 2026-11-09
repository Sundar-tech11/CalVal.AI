import React from 'react';
import { motion } from 'motion/react';

export const AnalyticsLoader: React.FC = () => {
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
          <filter id="anaGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="anaBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.04" />
          </linearGradient>

          <radialGradient id="anaPulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. HORIZONTAL BASELINE & GRID LINES                       */}
        {/* ========================================================= */}
        <line x1="50" y1="65" x2="390" y2="65" stroke="#262322" strokeWidth="0.7" strokeDasharray="3 3" />
        <line x1="50" y1="105" x2="390" y2="105" stroke="#262322" strokeWidth="0.7" strokeDasharray="3 3" />
        <line x1="50" y1="145" x2="390" y2="145" stroke="#262322" strokeWidth="0.7" strokeDasharray="3 3" />

        {/* Primary Baseline */}
        <motion.line
          x1="50"
          y1="172"
          x2="390"
          y2="172"
          stroke="#f59e0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          filter="url(#anaGoldGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, delay: 0.05 }}
        />

        {/* ========================================================= */}
        {/* 2. MULTIPLE BARS ANIMATING UPWARD                         */}
        {/* ========================================================= */}
        {[
          { x: 70, h: 40, delay: 0.2 },
          { x: 115, h: 65, delay: 0.24 },
          { x: 160, h: 88, delay: 0.28 },
          { x: 205, h: 112, delay: 0.32 },
          { x: 250, h: 98, delay: 0.36 },
          { x: 295, h: 126, delay: 0.40 },
          { x: 340, h: 114, delay: 0.44 }
        ].map((bar, i) => (
          <g key={`bar-${i}`}>
            <motion.rect
              x={bar.x}
              y={172 - bar.h}
              width="26"
              height={bar.h}
              rx="3"
              fill="url(#anaBarGradient)"
              stroke="#d97706"
              strokeWidth="0.8"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              style={{ originY: '172px' }}
              transition={{ duration: 0.3, delay: bar.delay, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* Golden top cap line on each bar */}
            <motion.line
              x1={bar.x}
              y1={172 - bar.h}
              x2={bar.x + 26}
              y2={172 - bar.h}
              stroke="#fbbf24"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, delay: bar.delay + 0.15 }}
            />
          </g>
        ))}

        {/* ========================================================= */}
        {/* 3. SMOOTH TRENDLINE CURVING ACROSS PEAKS                  */}
        {/* ========================================================= */}
        <motion.path
          d="M 83 132 C 128 107, 173 84, 218 60 C 263 74, 308 46, 353 58"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#anaGoldGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.52, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* ========================================================= */}
        {/* 4. GLOWING DATA POINTS AT VERTICES                        */}
        {/* ========================================================= */}
        {[
          { cx: 83, cy: 132, delay: 0.55 },
          { cx: 128, cy: 107, delay: 0.62 },
          { cx: 173, cy: 84, delay: 0.69 },
          { cx: 218, cy: 60, delay: 0.75 },
          { cx: 263, cy: 74, delay: 0.81 },
          { cx: 308, cy: 46, delay: 0.87 },
          { cx: 353, cy: 58, delay: 0.93 }
        ].map((pt, i) => (
          <motion.g
            key={`point-${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18, delay: pt.delay }}
          >
            <circle cx={pt.cx} cy={pt.cy} r="3" fill="#fef08a" filter="url(#anaGoldGlow)" />
            <circle cx={pt.cx} cy={pt.cy} r="6" stroke="#fbbf24" strokeWidth="0.7" strokeOpacity="0.7" />
          </motion.g>
        ))}

        {/* ========================================================= */}
        {/* 5. FINISH: GENTLE AMBIENT PULSE                           */}
        {/* ========================================================= */}
        <motion.circle
          cx="220"
          cy="110"
          r="80"
          fill="url(#anaPulseGlow)"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.7, 0.3], scale: [0.5, 1.15, 1.05] }}
          transition={{ duration: 0.45, delay: 0.95, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
};
