"use client";

import { motion } from "motion/react";
import type {
  UserProfile,
  SolvedStats,
  ContestInfo,
  SubmissionCalendar,
} from "@/types/leetcode";
import {
  calculateAcceptanceRate,
  parseSubmissionCalendar,
  calculateCurrentStreak,
  formatNumber,
} from "@/utils/calculations";
import { COMPARISON_COLORS } from "@/constants";

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

interface ComparisonTableProps {
  users: ComparisonUserData[];
}

interface MetricRow {
  label: string;
  values: number[];
  format?: (v: number) => string;
  higherIsBetter: boolean;
}

// ============================================================
// Helpers
// ============================================================

function getMetricRows(users: ComparisonUserData[]): MetricRow[] {
  return [
    {
      label: "Total Solved",
      values: users.map((u) => u.solved?.solvedProblem ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Easy",
      values: users.map((u) => u.solved?.easySolved ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Medium",
      values: users.map((u) => u.solved?.mediumSolved ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Hard",
      values: users.map((u) => u.solved?.hardSolved ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Contest Rating",
      values: users.map((u) =>
        u.contest ? Math.round(u.contest.contestRating) : 0
      ),
      higherIsBetter: true,
    },
    {
      label: "Acceptance Rate",
      values: users.map((u) =>
        u.solved ? calculateAcceptanceRate(u.solved) : 0
      ),
      format: (v) => `${v}%`,
      higherIsBetter: true,
    },
    {
      label: "Ranking",
      values: users.map((u) => u.profile?.ranking ?? 0),
      format: (v) => (v > 0 ? formatNumber(v) : "N/A"),
      higherIsBetter: false,
    },
    {
      label: "Active Days",
      values: users.map((u) => u.calendar?.totalActiveDays ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Streak",
      values: users.map((u) => {
        if (!u.calendar) return 0;
        const days = parseSubmissionCalendar(u.calendar.submissionCalendar);
        return calculateCurrentStreak(days);
      }),
      higherIsBetter: true,
    },
  ];
}

function getBestWorstIndices(
  values: number[],
  higherIsBetter: boolean
): { bestIdx: number; worstIdx: number } {
  const nonZero = values.filter((v) => v > 0);
  if (nonZero.length === 0) return { bestIdx: -1, worstIdx: -1 };

  let bestIdx = 0;
  let worstIdx = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] === 0) continue;
    if (higherIsBetter) {
      if (values[i] > values[bestIdx]) bestIdx = i;
      if (values[i] < values[worstIdx] || values[worstIdx] === 0)
        worstIdx = i;
    } else {
      if (values[i] < values[bestIdx] || values[bestIdx] === 0) bestIdx = i;
      if (values[i] > values[worstIdx]) worstIdx = i;
    }
  }

  // Don't mark worst if all values are the same
  if (bestIdx === worstIdx) worstIdx = -1;
  const allSame = values.every((v) => v === values[0]);
  if (allSame) return { bestIdx: -1, worstIdx: -1 };

  return { bestIdx, worstIdx };
}

// ============================================================
// Component
// ============================================================

export function ComparisonTable({ users }: ComparisonTableProps) {
  const metrics = getMetricRows(users);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[600px] text-sm" role="table">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th
                className="px-4 py-3 text-left font-semibold text-muted-foreground"
                scope="col"
              >
                Metric
              </th>
              {users.map((user, i) => (
                <th
                  key={user.username}
                  className="px-4 py-3 text-center font-semibold"
                  scope="col"
                >
                  <span
                    className="inline-flex items-center gap-2"
                    style={{ color: COMPARISON_COLORS[i] }}
                  >
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{ backgroundColor: COMPARISON_COLORS[i] }}
                      aria-hidden="true"
                    />
                    {user.username}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, rowIdx) => {
              const { bestIdx, worstIdx } = getBestWorstIndices(
                metric.values,
                metric.higherIsBetter
              );
              return (
                <tr
                  key={metric.label}
                  className={`border-b border-border last:border-b-0 transition-colors hover:bg-muted/30 ${
                    rowIdx % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {metric.label}
                  </td>
                  {metric.values.map((value, colIdx) => {
                    const isBest = colIdx === bestIdx;
                    const isWorst = colIdx === worstIdx;
                    const formatted = metric.format
                      ? metric.format(value)
                      : value.toString();

                    return (
                      <td
                        key={`${metric.label}-${users[colIdx].username}`}
                        className={`px-4 py-3 text-center font-mono tabular-nums ${
                          isBest
                            ? "bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400"
                            : isWorst
                              ? "bg-red-500/10 text-red-500 dark:text-red-400"
                              : "text-foreground"
                        }`}
                      >
                        {formatted}
                        {isBest && (
                          <span
                            className="ml-1 text-xs"
                            aria-label="Best value"
                          >
                            👑
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
