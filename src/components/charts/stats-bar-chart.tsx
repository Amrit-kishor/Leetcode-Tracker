"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { DIFFICULTY_COLORS } from "@/constants";

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

interface StatsBarChartProps {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
}

interface BarEntry {
  name: string;
  solved: number;
  total: number;
  percentage: number;
  color: string;
  lightColor: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: BarEntry }>;
}

// -----------------------------------------------------------
// Custom Tooltip
// -----------------------------------------------------------

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2.5 shadow-lg">
      <p className="mb-1 text-sm font-semibold" style={{ color: entry.color }}>
        {entry.name}
      </p>
      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>
          Solved:{" "}
          <span className="font-medium text-foreground">{entry.solved}</span>
          <span className="text-muted-foreground"> / {entry.total}</span>
        </p>
        <p>
          Progress:{" "}
          <span className="font-medium text-foreground">
            {entry.percentage.toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// Percentage label renderer
// -----------------------------------------------------------

function renderPercentageLabel(props: any) {
  const { x = 0, y = 0, width = 0, value = 0 } = props;
  const numVal = typeof value === "number" ? value : parseFloat(value) || 0;
  const numX = typeof x === "number" ? x : parseFloat(x) || 0;
  const numY = typeof y === "number" ? y : parseFloat(y) || 0;
  const numWidth = typeof width === "number" ? width : parseFloat(width) || 0;
  return (
    <text
      x={numX + numWidth / 2}
      y={numY - 8}
      textAnchor="middle"
      dominantBaseline="middle"
      className="fill-foreground text-[11px] font-medium"
    >
      {numVal.toFixed(0)}%
    </text>
  );
}

// -----------------------------------------------------------
// Component
// -----------------------------------------------------------

export default function StatsBarChart({
  easySolved,
  mediumSolved,
  hardSolved,
  easyTotal,
  mediumTotal,
  hardTotal,
}: StatsBarChartProps) {
  const data: BarEntry[] = [
    {
      name: "Easy",
      solved: easySolved,
      total: easyTotal,
      percentage: easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0,
      color: DIFFICULTY_COLORS.easy.bg,
      lightColor: DIFFICULTY_COLORS.easy.light,
    },
    {
      name: "Medium",
      solved: mediumSolved,
      total: mediumTotal,
      percentage: mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0,
      color: DIFFICULTY_COLORS.medium.bg,
      lightColor: DIFFICULTY_COLORS.medium.light,
    },
    {
      name: "Hard",
      solved: hardSolved,
      total: hardTotal,
      percentage: hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0,
      color: DIFFICULTY_COLORS.hard.bg,
      lightColor: DIFFICULTY_COLORS.hard.light,
    },
  ];

  const maxTotal = Math.max(easyTotal, mediumTotal, hardTotal, 1);

  return (
    <div className="h-full w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 24, right: 8, left: -12, bottom: 0 }}
          barGap={6}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border"
            opacity={0.3}
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            domain={[0, maxTotal]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />

          <Tooltip
            content={<ChartTooltip />}
            wrapperStyle={{ outline: "none" }}
            cursor={{ fill: "currentColor", opacity: 0.05 }}
          />

          {/* Total (background) bars */}
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            opacity={0.2}
            animationBegin={0}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={`total-${entry.name}`} fill={entry.color} />
            ))}
          </Bar>

          {/* Solved (foreground) bars */}
          <Bar
            dataKey="solved"
            radius={[4, 4, 0, 0]}
            animationBegin={200}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={`solved-${entry.name}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="percentage"
              content={renderPercentageLabel}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
