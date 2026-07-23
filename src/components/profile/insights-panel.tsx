"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SolvedStats, ContestInfo, SubmissionCalendar } from "@/types/leetcode";
import { generateInsights } from "@/utils/insights";

interface InsightsPanelProps {
  solved: SolvedStats;
  contest: ContestInfo | null;
  calendar: SubmissionCalendar | null;
}

export function InsightsPanel({ solved, contest, calendar }: InsightsPanelProps) {
  const insights = useMemo(() => {
    return generateInsights(solved, contest, calendar);
  }, [solved, contest, calendar]);

  if (insights.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <LucideIcons.Sparkles className="h-10 w-10 text-muted-foreground mb-3 animate-pulse" />
          <h3 className="text-lg font-semibold">Generating Insights...</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Solve more problems, increase submission frequency, or compete in contests to receive custom AI analytical insights!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper to map insight type to styles
  const getTypeStyles = (type: "strength" | "improvement" | "info" | "achievement") => {
    switch (type) {
      case "achievement":
        return {
          bg: "bg-indigo-500/10 border-indigo-500/20 dark:bg-indigo-950/20",
          iconBg: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
          badge: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400",
        };
      case "strength":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-950/20",
          iconBg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
          badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
        };
      case "improvement":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 dark:bg-amber-950/20",
          iconBg: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
          badge: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
        };
      case "info":
      default:
        return {
          bg: "bg-cyan-500/10 border-cyan-500/20 dark:bg-cyan-950/20",
          iconBg: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
          badge: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20 dark:text-cyan-400",
        };
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LucideIcons.Sparkles className="h-5 w-5 text-indigo-500" />
            LeetCode Performance Insights
          </CardTitle>
          <CardDescription>
            Tailored analysis of your coding speed, difficulty choice, contest results, and streak consistency.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {insights.map((insight, index) => {
            const styles = getTypeStyles(insight.type);
            // Dynamic Icon resolve
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const Icon = (LucideIcons as any)[insight.icon] || LucideIcons.HelpCircle;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative overflow-hidden rounded-xl border p-5 flex gap-4 ${styles.bg}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-sm leading-none text-foreground">
                      {insight.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles.badge}`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
