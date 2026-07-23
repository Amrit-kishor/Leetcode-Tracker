"use client";

import { useCallback, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";
import { DIFFICULTY_COLORS } from "@/constants";
 
const RechartsPie = Pie as any;

// -----------------------------------------------------------
// Types
// -----------------------------------------------------------

interface DifficultyPieChartProps {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

interface PieEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PieEntry }>;
  total: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: PieEntry;
  percent: number;
  value: number;
}

// -----------------------------------------------------------
// Custom Tooltip
// -----------------------------------------------------------

function ChartTooltip({ active, payload, total }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0].payload;
  const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-sm font-semibold" style={{ color: entry.color }}>
        {entry.name}
      </p>
      <p className="text-sm text-muted-foreground">
        {entry.value} solved ({pct}%)
      </p>
    </div>
  );
}

// -----------------------------------------------------------
// Active Shape (hover ring)
// -----------------------------------------------------------

function renderActiveShape(props: ActiveShapeProps) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

// -----------------------------------------------------------
// Component
// -----------------------------------------------------------

export default function DifficultyPieChart({
  easySolved,
  mediumSolved,
  hardSolved,
}: DifficultyPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const total = easySolved + mediumSolved + hardSolved;

  const data: PieEntry[] = [
    { name: "Easy", value: easySolved, color: DIFFICULTY_COLORS.easy.bg },
    { name: "Medium", value: mediumSolved, color: DIFFICULTY_COLORS.medium.bg },
    { name: "Hard", value: hardSolved, color: DIFFICULTY_COLORS.hard.bg },
  ];

  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  return (
    <div className="relative h-full w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <RechartsPie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
            activeIndex={activeIndex}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            activeShape={renderActiveShape as any}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </RechartsPie>
          <Tooltip
            content={<ChartTooltip total={total} />}
            wrapperStyle={{ outline: "none" }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {total}
        </span>
        <span className="text-xs text-muted-foreground">Solved</span>
      </div>
    </div>
  );
}
