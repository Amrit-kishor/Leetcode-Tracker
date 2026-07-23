"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DIFFICULTY_COLORS, TOTAL_LEETCODE_PROBLEMS } from "@/constants";
import type { SolvedStats } from "@/types/leetcode";

const DifficultyPieChart = dynamic(
  () => import("@/components/charts/difficulty-pie-chart"),
  { ssr: false }
);

const StatsBarChart = dynamic(
  () => import("@/components/charts/stats-bar-chart"),
  { ssr: false }
);

interface DifficultySectionProps {
  solved: SolvedStats;
}

export function DifficultySection({ solved }: DifficultySectionProps) {
  const easyPct = (solved.easySolved / TOTAL_LEETCODE_PROBLEMS.easy) * 100;
  const mediumPct = (solved.mediumSolved / TOTAL_LEETCODE_PROBLEMS.medium) * 100;
  const hardPct = (solved.hardSolved / TOTAL_LEETCODE_PROBLEMS.hard) * 100;

  // Helper to extract acceptance info per difficulty
  const getDifficultyStats = (diff: "Easy" | "Medium" | "Hard") => {
    const totalSub = solved.totalSubmissionNum.find((s) => s.difficulty === diff)?.submissions ?? 0;
    const acSub = solved.acSubmissionNum.find((s) => s.difficulty === diff)?.submissions ?? 0;
    const rate = totalSub > 0 ? ((acSub / totalSub) * 100).toFixed(1) : "0.0";
    return { totalSub, acSub, rate };
  };

  const easyStats = getDifficultyStats("Easy");
  const mediumStats = getDifficultyStats("Medium");
  const hardStats = getDifficultyStats("Hard");

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Solved stats details */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-1">
        <CardHeader>
          <CardTitle>Difficulty Breakdown</CardTitle>
          <CardDescription>
            Your solved problems categorized by difficulty level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Easy Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-emerald-500">Easy</span>
              <span className="text-muted-foreground">
                <span className="font-bold text-foreground">{solved.easySolved}</span>
                <span>/{TOTAL_LEETCODE_PROBLEMS.easy}</span>
                <span className="ml-1.5 text-xs bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">
                  {easyPct.toFixed(1)}%
                </span>
              </span>
            </div>
            <Progress
              value={easyPct}
              className="h-2"
              indicatorClassName="bg-emerald-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Acceptance Rate: {easyStats.rate}%</span>
              <span>Submissions: {easyStats.totalSub.toLocaleString()}</span>
            </div>
          </div>

          {/* Medium Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-amber-500">Medium</span>
              <span className="text-muted-foreground">
                <span className="font-bold text-foreground">{solved.mediumSolved}</span>
                <span>/{TOTAL_LEETCODE_PROBLEMS.medium}</span>
                <span className="ml-1.5 text-xs bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">
                  {mediumPct.toFixed(1)}%
                </span>
              </span>
            </div>
            <Progress
              value={mediumPct}
              className="h-2"
              indicatorClassName="bg-amber-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Acceptance Rate: {mediumStats.rate}%</span>
              <span>Submissions: {mediumStats.totalSub.toLocaleString()}</span>
            </div>
          </div>

          {/* Hard Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-red-500">Hard</span>
              <span className="text-muted-foreground">
                <span className="font-bold text-foreground">{solved.hardSolved}</span>
                <span>/{TOTAL_LEETCODE_PROBLEMS.hard}</span>
                <span className="ml-1.5 text-xs bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">
                  {hardPct.toFixed(1)}%
                </span>
              </span>
            </div>
            <Progress
              value={hardPct}
              className="h-2"
              indicatorClassName="bg-red-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Acceptance Rate: {hardStats.rate}%</span>
              <span>Submissions: {hardStats.totalSub.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Solved Distribution</CardTitle>
          <CardDescription>
            Ratio of solved problems across difficulty categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[280px] items-center justify-center">
          <DifficultyPieChart
            easySolved={solved.easySolved}
            mediumSolved={solved.mediumSolved}
            hardSolved={solved.hardSolved}
          />
        </CardContent>
      </Card>

      {/* Bar Chart Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Completion Proportions</CardTitle>
          <CardDescription>
            Comparison of solved counts vs total available on LeetCode.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[280px] items-center justify-center">
          <StatsBarChart
            easySolved={solved.easySolved}
            mediumSolved={solved.mediumSolved}
            hardSolved={solved.hardSolved}
            easyTotal={TOTAL_LEETCODE_PROBLEMS.easy}
            mediumTotal={TOTAL_LEETCODE_PROBLEMS.medium}
            hardTotal={TOTAL_LEETCODE_PROBLEMS.hard}
          />
        </CardContent>
      </Card>
    </div>
  );
}
