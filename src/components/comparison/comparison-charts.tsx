"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPARISON_COLORS } from "@/constants";
import {
  calculateAcceptanceRate,
  parseSubmissionCalendar,
  calculateCurrentStreak,
} from "@/utils/calculations";
import type {
  UserProfile,
  SolvedStats,
  ContestInfo,
  SubmissionCalendar,
} from "@/types/leetcode";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ============================================================
// Types
// ============================================================

export interface ComparisonUserData {
  username: string;
  profile: UserProfile | null;
  solved: SolvedStats | null;
  contest: ContestInfo | null;
  calendar: SubmissionCalendar | null;
}

interface ComparisonChartsProps {
  users: ComparisonUserData[];
}

// ============================================================
// Data transformations
// ============================================================

function normalizeValue(value: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((value / max) * 100);
}

function buildRadarData(users: ComparisonUserData[]) {
  const dimensions = [
    "Total Solved",
    "Easy",
    "Medium",
    "Hard",
    "Contest Rating",
    "Acceptance %",
    "Active Days",
    "Streak",
  ] as const;

  // Find max for each dimension to normalize
  const maxValues: Record<string, number> = {};
  dimensions.forEach((dim) => {
    maxValues[dim] = Math.max(
      ...users.map((u) => {
        switch (dim) {
          case "Total Solved":
            return u.solved?.solvedProblem ?? 0;
          case "Easy":
            return u.solved?.easySolved ?? 0;
          case "Medium":
            return u.solved?.mediumSolved ?? 0;
          case "Hard":
            return u.solved?.hardSolved ?? 0;
          case "Contest Rating":
            return u.contest?.contestRating ?? 0;
          case "Acceptance %":
            return u.solved ? calculateAcceptanceRate(u.solved) : 0;
          case "Active Days":
            return u.calendar?.totalActiveDays ?? 0;
          case "Streak": {
            if (!u.calendar) return 0;
            const days = parseSubmissionCalendar(
              u.calendar.submissionCalendar
            );
            return calculateCurrentStreak(days);
          }
          default:
            return 0;
        }
      }),
      1
    );
  });

  return dimensions.map((dim) => {
    const entry: Record<string, string | number> = { dimension: dim };
    users.forEach((u) => {
      let raw = 0;
      switch (dim) {
        case "Total Solved":
          raw = u.solved?.solvedProblem ?? 0;
          break;
        case "Easy":
          raw = u.solved?.easySolved ?? 0;
          break;
        case "Medium":
          raw = u.solved?.mediumSolved ?? 0;
          break;
        case "Hard":
          raw = u.solved?.hardSolved ?? 0;
          break;
        case "Contest Rating":
          raw = u.contest?.contestRating ?? 0;
          break;
        case "Acceptance %":
          raw = u.solved ? calculateAcceptanceRate(u.solved) : 0;
          break;
        case "Active Days":
          raw = u.calendar?.totalActiveDays ?? 0;
          break;
        case "Streak": {
          if (!u.calendar) break;
          const days = parseSubmissionCalendar(u.calendar.submissionCalendar);
          raw = calculateCurrentStreak(days);
          break;
        }
      }
      entry[u.username] = normalizeValue(raw, maxValues[dim]);
    });
    return entry;
  });
}

function buildBarData(users: ComparisonUserData[]) {
  const categories = ["Easy", "Medium", "Hard"] as const;
  return categories.map((cat) => {
    const entry: Record<string, string | number> = { category: cat };
    users.forEach((u) => {
      switch (cat) {
        case "Easy":
          entry[u.username] = u.solved?.easySolved ?? 0;
          break;
        case "Medium":
          entry[u.username] = u.solved?.mediumSolved ?? 0;
          break;
        case "Hard":
          entry[u.username] = u.solved?.hardSolved ?? 0;
          break;
      }
    });
    return entry;
  });
}

// ============================================================
// Custom Legend
// ============================================================

function UserLegend({ users }: { users: ComparisonUserData[] }) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-4 pt-2"
      role="list"
      aria-label="User legend"
    >
      {users.map((u, i) => (
        <div
          key={u.username}
          className="flex items-center gap-1.5 text-sm"
          role="listitem"
        >
          <span
            className="inline-block size-3 rounded-full"
            style={{ backgroundColor: COMPARISON_COLORS[i] }}
            aria-hidden="true"
          />
          <span className="font-medium">{u.username}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Component
// ============================================================

export function ComparisonCharts({ users }: ComparisonChartsProps) {
  const radarData = buildRadarData(users);
  const barData = buildBarData(users);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Skill Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  {users.map((u, i) => (
                    <Radar
                      key={u.username}
                      name={u.username}
                      dataKey={u.username}
                      stroke={COMPARISON_COLORS[i]}
                      fill={COMPARISON_COLORS[i]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <UserLegend users={users} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Solved by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={4} barCategoryGap="20%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend />
                  {users.map((u, i) => (
                    <Bar
                      key={u.username}
                      dataKey={u.username}
                      fill={COMPARISON_COLORS[i]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
