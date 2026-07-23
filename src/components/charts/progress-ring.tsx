"use client";

import { CHART_COLORS } from "@/constants";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

interface ProgressRingProps {
  /** Progress value from 0 to 100 */
  value: number;
  /** Diameter of the ring in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Color of the progress arc */
  color?: string;
  /** Optional label below the percentage */
  label?: string;
}

// -----------------------------------------------------------
// Component
// -----------------------------------------------------------

export default function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = CHART_COLORS.primary,
  label,
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${clampedValue}%` : `${clampedValue}%`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted/20"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: size * 0.2 }}
        >
          {Math.round(clampedValue)}%
        </span>
        {label && (
          <span
            className="text-muted-foreground"
            style={{ fontSize: Math.max(size * 0.09, 10) }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
