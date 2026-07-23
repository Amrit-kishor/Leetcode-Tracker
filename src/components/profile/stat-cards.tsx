"use client";

import { motion } from "motion/react";
import {
  CheckCircle,
  Zap,
  Target,
  Flame,
  BarChart3,
  Award,
  Send,
  Trophy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SolvedStats, UserBadges } from "@/types/leetcode";
import {
  calculateAcceptanceRate,
  getTotalSubmissions,
} from "@/utils/calculations";
import { TOTAL_LEETCODE_PROBLEMS } from "@/constants";
import { AnimatedCounter } from "./animated-counter-inline";

interface StatCardsProps {
  solved: SolvedStats;
  badges: UserBadges | undefined;
}

const STAT_CONFIGS = [
  {
    key: "total",
    label: "Total Solved",
    icon: CheckCircle,
    gradient: "from-indigo-500/15 to-indigo-600/15",
    iconColor: "text-indigo-500",
    borderColor: "border-indigo-500/20",
    tooltipText: "Total problems solved across all difficulties",
  },
  {
    key: "easy",
    label: "Easy",
    icon: Zap,
    gradient: "from-emerald-500/15 to-emerald-600/15",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/20",
    tooltipText: "Easy problems solved",
  },
  {
    key: "medium",
    label: "Medium",
    icon: Target,
    gradient: "from-amber-500/15 to-amber-600/15",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/20",
    tooltipText: "Medium problems solved",
  },
  {
    key: "hard",
    label: "Hard",
    icon: Flame,
    gradient: "from-red-500/15 to-red-600/15",
    iconColor: "text-red-500",
    borderColor: "border-red-500/20",
    tooltipText: "Hard problems solved",
  },
  {
    key: "acceptance",
    label: "Acceptance",
    icon: BarChart3,
    gradient: "from-purple-500/15 to-purple-600/15",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/20",
    tooltipText: "Ratio of accepted submissions to total submissions",
  },
  {
    key: "submissions",
    label: "Submissions",
    icon: Send,
    gradient: "from-cyan-500/15 to-cyan-600/15",
    iconColor: "text-cyan-500",
    borderColor: "border-cyan-500/20",
    tooltipText: "Total number of submissions made",
  },
  {
    key: "badges",
    label: "Badges",
    icon: Award,
    gradient: "from-pink-500/15 to-pink-600/15",
    iconColor: "text-pink-500",
    borderColor: "border-pink-500/20",
    tooltipText: "Achievement badges earned",
  },
  {
    key: "rank",
    label: "Attempted",
    icon: Trophy,
    gradient: "from-orange-500/15 to-orange-600/15",
    iconColor: "text-orange-500",
    borderColor: "border-orange-500/20",
    tooltipText: "Total problems attempted",
  },
] as const;

function getStatValue(
  key: string,
  solved: SolvedStats,
  badges: UserBadges | undefined
): { value: number; max?: number; suffix?: string } {
  switch (key) {
    case "total":
      return { value: solved.solvedProblem, max: TOTAL_LEETCODE_PROBLEMS.total };
    case "easy":
      return { value: solved.easySolved, max: TOTAL_LEETCODE_PROBLEMS.easy };
    case "medium":
      return { value: solved.mediumSolved, max: TOTAL_LEETCODE_PROBLEMS.medium };
    case "hard":
      return { value: solved.hardSolved, max: TOTAL_LEETCODE_PROBLEMS.hard };
    case "acceptance":
      return { value: calculateAcceptanceRate(solved), suffix: "%" };
    case "submissions":
      return { value: getTotalSubmissions(solved) };
    case "badges":
      return { value: badges?.badges?.length ?? 0 };
    case "rank": {
      const totalAttempted =
        solved.totalSubmissionNum.find((s) => s.difficulty === "All")?.count ?? 0;
      return { value: totalAttempted };
    }
    default:
      return { value: 0 };
  }
}

export function StatCards({ solved, badges }: StatCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIGS.map((config, index) => {
        const Icon = config.icon;
        const stat = getStatValue(config.key, solved, badges);

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className={`group relative overflow-hidden border-border/50 ${config.borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5`}
                >
                  <CardContent className="p-4">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 transition-opacity group-hover:opacity-50`}
                    />
                    <div className="relative">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {config.label}
                        </span>
                        <Icon className={`h-4 w-4 ${config.iconColor}`} />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tabular-nums">
                          <AnimatedCounter
                            value={stat.value}
                            suffix={stat.suffix}
                          />
                        </span>
                        {stat.max && (
                          <span className="text-xs text-muted-foreground">
                            / {stat.max}
                          </span>
                        )}
                      </div>
                      {stat.max && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient.replace('/15', '/80')}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                100,
                                (stat.value / stat.max) * 100
                              )}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.05 + 0.3,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>{config.tooltipText}</TooltipContent>
            </Tooltip>
          </motion.div>
        );
      })}
    </div>
  );
}
