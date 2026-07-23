"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/constants";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

interface ContestDataPoint {
  contest: string;
  rating: number;
  ranking: number;
}

interface ContestAreaChartProps {
  data: ContestDataPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ContestDataPoint }>;
  label?: string;
}

// -----------------------------------------------------------
// Custom Tooltip
// -----------------------------------------------------------

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 shadow-lg">
      <p className="mb-1 text-sm font-semibold text-foreground">
        {entry.contest}
      </p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>
          Rating:{" "}
          <span className="font-medium text-foreground">
            {entry.rating.toLocaleString()}
          </span>
        </p>
        <p>
          Ranking:{" "}
          <span className="font-medium text-foreground">
            #{entry.ranking.toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// Component
// -----------------------------------------------------------

export default function ContestAreaChart({ data }: ContestAreaChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-sm text-muted-foreground">
        No contest data available
      </div>
    );
  }

  const minRating = Math.floor(Math.min(...data.map((d) => d.rating)) * 0.95);
  const maxRating = Math.ceil(Math.max(...data.map((d) => d.rating)) * 1.05);

  return (
    <div className="h-full w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_COLORS.primary}
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS.secondary}
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border"
            opacity={0.3}
          />

          <XAxis
            dataKey="contest"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minRating, maxRating]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />

          <Tooltip
            content={<ChartTooltip />}
            wrapperStyle={{ outline: "none" }}
            cursor={{
              stroke: CHART_COLORS.primary,
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />

          <Area
            type="monotone"
            dataKey="rating"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            fill="url(#ratingGradient)"
            activeDot={{
              r: 5,
              fill: CHART_COLORS.primary,
              stroke: "#fff",
              strokeWidth: 2,
            }}
            dot={false}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
