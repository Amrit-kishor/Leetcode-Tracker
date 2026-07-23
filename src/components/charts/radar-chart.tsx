"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CHART_COLORS } from "@/constants";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

interface RadarDataPoint {
  category: string;
  value: number;
  fullMark: number;
}

interface SkillRadarChartProps {
  data: RadarDataPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: RadarDataPoint }>;
}

// -----------------------------------------------------------
// Custom Tooltip
// -----------------------------------------------------------

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0].payload;
  const pct =
    entry.fullMark > 0
      ? ((entry.value / entry.fullMark) * 100).toFixed(0)
      : "0";

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="mb-0.5 text-sm font-semibold text-foreground">
        {entry.category}
      </p>
      <p className="text-sm text-muted-foreground">
        {entry.value}{" "}
        <span className="text-xs">/ {entry.fullMark}</span>
        <span className="ml-1 text-xs opacity-70">({pct}%)</span>
      </p>
    </div>
  );
}

// -----------------------------------------------------------
// Component
// -----------------------------------------------------------

export default function SkillRadarChart({ data }: SkillRadarChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-sm text-muted-foreground">
        No skill data available
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="75%"
          data={data}
        >
          <PolarGrid
            stroke="currentColor"
            className="text-border"
            opacity={0.3}
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <PolarRadiusAxis
            angle={90}
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            axisLine={false}
          />

          <Tooltip
            content={<ChartTooltip />}
            wrapperStyle={{ outline: "none" }}
          />

          <Radar
            name="Skills"
            dataKey="value"
            stroke={CHART_COLORS.primary}
            fill={CHART_COLORS.secondary}
            fillOpacity={0.25}
            strokeWidth={2}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
            dot={{
              r: 3,
              fill: CHART_COLORS.primary,
              stroke: "#fff",
              strokeWidth: 1.5,
            }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
