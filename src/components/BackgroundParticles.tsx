import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Warm luxury palette: gold, amber, and neutral stone
    const palette = [
      'rgba(245, 158, 11,', // amber-500
      'rgba(251, 191, 36,', // amber-400
      'rgba(217, 119, 6,',  // amber-600
      'rgba(214, 211, 209,', // stone-300
    ];

    // Determine particle count based on screen size (sparingly spaced)
    const particleCount = Math.min(45, Math.max(20, Math.floor((width * height) / 35000)));

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.75, // 0.75px to 2.25px
        color: palette[Math.floor(Math.random() * palette.length)],
        vx: (Math.random() - 0.5) * 0.25, // Gentle drift
        vy: -0.15 - Math.random() * 0.2, // Subtle upward floating
        baseAlpha: Math.random() * 0.25 + 0.1, // 0.1 to 0.35 opacity
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // If reduced motion is preferred, draw once and do not run animation loop
    if (shouldReduceMotion) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.baseAlpha * 0.6})`;
        ctx.fill();
      });
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isDocumentVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges seamlessly
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          // Gentle alpha pulse
          p.pulsePhase += p.pulseSpeed;
          const alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.08;
          const clampedAlpha = Math.max(0.04, Math.min(0.4, alpha));

          // Draw soft glowing particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color} ${clampedAlpha})`;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.3)';
          ctx.shadowBlur = 4;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};

export default BackgroundParticles;
