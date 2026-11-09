import React from 'react';
import { motion } from 'motion/react';

export const MapLoader: React.FC = () => {
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
          <filter id="mapGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="caMapPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ========================================================= */}
        {/* 1. SUBTLE GEOGRAPHIC GRID MARKS                           */}
        {/* ========================================================= */}
        <line x1="140" y1="55" x2="310" y2="55" stroke="#262322" strokeWidth="0.7" strokeDasharray="3 3" />
        <line x1="140" y1="110" x2="310" y2="110" stroke="#262322" strokeWidth="0.7" strokeDasharray="3 3" />
        <line x1="140" y1="165" x2="310" y2="165" stroke="#262322" strokeWidth="0.7" strokeDasharray="3 3" />

        {/* ========================================================= */}
        {/* 2. CALIFORNIA STATE GEOGRAPHIC OUTLINE                    */}
        {/* ========================================================= */}
        <motion.path
          d="M 175 25 
             L 245 25 
             L 245 68 
             L 320 152 
             L 320 188 
             L 282 188 
             L 260 168 
             C 245 165, 230 158, 220 150 
             L 190 120 
             C 178 108, 172 95, 174 88 
             C 165 72, 162 55, 175 25 Z"
          stroke="#f59e0b"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="rgba(245,158,11,0.03)"
          filter="url(#mapGoldGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Pacific Coastal Wave Contour */}
        <motion.path
          d="M 162 35 C 150 65, 162 110, 205 145 C 225 160, 245 175, 255 185"
          stroke="#38bdf8"
          strokeWidth="0.7"
          strokeDasharray="4 3"
          strokeOpacity="0.35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        />

        {/* ========================================================= */}
        {/* 3. GLOWING LOCATION HUBS                                  */}
        {/* ========================================================= */}
        {/* San Francisco Bay Area (X=175, Y=90) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.42 }}
        >
          <circle cx="175" cy="90" r="3" fill="#fef08a" filter="url(#mapGoldGlow)" />
          <circle cx="175" cy="90" r="7" stroke="#fbbf24" strokeWidth="0.7" strokeOpacity="0.7" />
          <text x="135" y="88" fill="#fbbf24" fontSize="7.5" fontWeight="500" fontFamily="monospace">SF BAY</text>
        </motion.g>

        {/* Silicon Valley (X=185, Y=104) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.48 }}
        >
          <circle cx="185" cy="104" r="2.5" fill="#f59e0b" />
          <text x="120" y="106" fill="#a8a29e" fontSize="7" fontFamily="monospace">SILICON VALLEY</text>
        </motion.g>

        {/* Los Angeles Basin (X=250, Y=158) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.58 }}
        >
          <circle cx="250" cy="158" r="3" fill="#fef08a" filter="url(#mapGoldGlow)" />
          <circle cx="250" cy="158" r="7" stroke="#fbbf24" strokeWidth="0.7" strokeOpacity="0.7" />
          <text x="264" y="156" fill="#fbbf24" fontSize="7.5" fontWeight="500" fontFamily="monospace">LOS ANGELES</text>
        </motion.g>

        {/* San Diego (X=275, Y=180) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.65 }}
        >
          <circle cx="275" cy="180" r="2.5" fill="#f59e0b" />
          <text x="286" y="182" fill="#a8a29e" fontSize="7" fontFamily="monospace">SAN DIEGO</text>
        </motion.g>

        {/* ========================================================= */}
        {/* 4. CONNECTING SUBTLE CONDUITS                             */}
        {/* ========================================================= */}
        {/* SF -> Silicon Valley */}
        <motion.path
          d="M 175 90 L 185 104"
          stroke="#f59e0b"
          strokeWidth="1.1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.2, delay: 0.55 }}
        />
        {/* Silicon Valley -> LA */}
        <motion.path
          d="M 185 104 Q 220 135, 250 158"
          stroke="#fbbf24"
          strokeWidth="1.1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.32, delay: 0.62 }}
        />
        {/* LA -> San Diego */}
        <motion.path
          d="M 250 158 L 275 180"
          stroke="#f59e0b"
          strokeWidth="1.1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.2, delay: 0.72 }}
        />

        {/* ========================================================= */}
        {/* 5. FINISH: SOFT TERRITORIAL PULSE                         */}
        {/* ========================================================= */}
        <motion.circle
          cx="225"
          cy="110"
          r="75"
          fill="url(#caMapPulse)"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 0.75, 0.35], scale: [0.4, 1.15, 1.05] }}
          transition={{ duration: 0.5, delay: 0.85, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
};
