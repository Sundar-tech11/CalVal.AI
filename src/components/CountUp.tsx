import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export interface CountUpProps {
  value: number;
  duration?: number; // duration in seconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  preserveSign?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  preserveSign = false,
}) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [displayValue, setDisplayValue] = useState<number>(() => (shouldReduceMotion ? value : 0));
  const [hasEnteredView, setHasEnteredView] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const previousValueRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Viewport observer to trigger animation when scrolled into view
  useEffect(() => {
    if (shouldReduceMotion) {
      setHasEnteredView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldReduceMotion]);

  // Animate whenever hasEnteredView becomes true OR value changes
  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      previousValueRef.current = value;
      return;
    }

    if (!hasEnteredView) {
      return;
    }

    const startValue = previousValueRef.current;
    const targetValue = value;
    const startTime = performance.now();
    const durationMs = Math.max(300, duration * 1000);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (targetValue - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        previousValueRef.current = targetValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, hasEnteredView, duration, shouldReduceMotion]);

  // Format string
  const signPrefix = preserveSign && displayValue > 0 ? '+' : '';
  const formattedNumber =
    decimals > 0
      ? displayValue.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(displayValue).toLocaleString();

  return (
    <span ref={containerRef} className={className}>
      {signPrefix}
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};

export default CountUp;
