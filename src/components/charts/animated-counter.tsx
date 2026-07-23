"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useTransform,
  motion,
  animate,
} from "motion/react";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

interface AnimatedCounterProps {
  /** Target number to count up to */
  value: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Prefix string (e.g. "$", "#") */
  prefix?: string;
  /** Suffix string (e.g. "%", "+") */
  suffix?: string;
  /** Number of decimal places */
  decimals?: number;
}

// -----------------------------------------------------------
// Component
// -----------------------------------------------------------

export default function AnimatedCounter({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    formatNumber(latest, decimals)
  );
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    });

    return () => controls.stop();
  }, [value, duration, motionValue]);

  // Subscribe to the transformed value and update DOM directly for
  // high-perf rendering without React re-renders on each frame.
  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = `${prefix}${v}${suffix}`;
      }
    });

    return () => unsubscribe();
  }, [rounded, prefix, suffix]);

  return (
    <motion.span
      ref={nodeRef}
      className="tabular-nums"
      aria-label={`${prefix}${formatNumber(value, decimals)}${suffix}`}
    >
      {prefix}0{suffix}
    </motion.span>
  );
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function formatNumber(n: number, decimals: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
