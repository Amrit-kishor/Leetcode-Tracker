"use client";

import { useMemo } from "react";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { Flame, Calendar, Award, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import type { SubmissionCalendar } from "@/types/leetcode";
import {
  parseSubmissionCalendar,
  calculateCurrentStreak,
  calculateLongestStreak,
} from "@/utils/calculations";

interface SubmissionHeatmapProps {
  calendar: SubmissionCalendar | null;
  isLoading: boolean;
}

export function SubmissionHeatmap({ calendar, isLoading }: SubmissionHeatmapProps) {
  const parsedDays = useMemo(() => {
    if (!calendar?.submissionCalendar) return [];
    return parseSubmissionCalendar(calendar.submissionCalendar);
  }, [calendar]);

  const currentStreak = useMemo(() => {
    return calculateCurrentStreak(parsedDays);
  }, [parsedDays]);

  const longestStreak = useMemo(() => {
    return calculateLongestStreak(parsedDays);
  }, [parsedDays]);

  const activeDays = calendar?.totalActiveDays ?? parsedDays.filter((d) => d.count > 0).length;

  const totalSubmissionsInYear = useMemo(() => {
    return parsedDays.reduce((acc, d) => acc + d.count, 0);
  }, [parsedDays]);

  // Generate 365 days of grid data
  const gridWeeks = useMemo(() => {
    if (isLoading) return [];

    const today = new Date();
    const startDate = startOfWeek(subDays(today, 364)); // Start on Sunday ~1 year ago
    const intervalDays = eachDayOfInterval({ start: startDate, end: today });

    const submissionsMap = new Map<string, number>();
    parsedDays.forEach((d) => {
      submissionsMap.set(d.date, d.count);
    });

    const allDaysData = intervalDays.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const count = submissionsMap.get(dateStr) || 0;
      return {
        date,
        dateStr,
        count,
        dayOfWeek: date.getDay(),
        month: format(date, "MMM"),
      };
    });

    // Group into weeks
    const weeksList = [];
    for (let i = 0; i < allDaysData.length; i += 7) {
      weeksList.push(allDaysData.slice(i, i + 7));
    }
    return weeksList;
  }, [parsedDays, isLoading]);

  // Determine contribution color cell class
  const getCellColor = (count: number) => {
    if (count === 0) return "bg-muted/40 border border-border/10";
    if (count <= 2) return "bg-emerald-500/20 dark:bg-emerald-500/10 hover:bg-emerald-500/30";
    if (count <= 5) return "bg-emerald-500/40 dark:bg-emerald-500/30 hover:bg-emerald-500/50";
    if (count <= 9) return "bg-emerald-500/70 dark:bg-emerald-500/60 hover:bg-emerald-500/80";
    return "bg-emerald-500 hover:bg-emerald-400";
  };

  // Month labels for top of the grid
  const monthLabels = useMemo(() => {
    const labels: { text: string; index: number }[] = [];
    let prevMonth = "";
    gridWeeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== prevMonth) {
        labels.push({ text: firstDay.month, index: weekIdx });
        prevMonth = firstDay.month;
      }
    });
    return labels;
  }, [gridWeeks]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
          <Skeleton className="h-[120px] rounded-xl" />
        </div>
        <Skeleton className="h-[250px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Days */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Active Days
            </CardDescription>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{activeDays}</div>
            <p className="text-xs text-muted-foreground mt-1">Days with at least 1 submission</p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Current Streak
            </CardDescription>
            <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold flex items-baseline gap-1.5">
              {currentStreak}
              <span className="text-xs font-medium text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentStreak > 0 ? "Keep it up!" : "Submit code today to start a streak!"}
            </p>
          </CardContent>
        </Card>

        {/* Longest Streak */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Longest Streak
            </CardDescription>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold flex items-baseline gap-1.5">
              {longestStreak}
              <span className="text-xs font-medium text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All-time record streak</p>
          </CardContent>
        </Card>

        {/* Total Annual Submissions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Yearly Submissions
            </CardDescription>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{totalSubmissionsInYear.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Submissions in the last 365 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Grid Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Submission Heatmap</CardTitle>
          <CardDescription>
            Activity calendar mapping code submissions over the past year.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto pb-6">
          <div className="min-w-[760px] flex flex-col select-none">
            {/* Months Header Row */}
            <div className="relative h-6 text-xs text-muted-foreground ml-8 flex">
              {monthLabels.map((lbl, idx) => (
                <div
                  key={`${lbl.text}-${idx}`}
                  className="absolute"
                  style={{ left: `${lbl.index * 13}px` }}
                >
                  {lbl.text}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="flex gap-1.5">
              {/* Day of week labels */}
              <div className="flex flex-col justify-between text-[10px] text-muted-foreground w-6 h-[96px] py-1 shrink-0">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Heatmap columns */}
              <div className="flex gap-1">
                {gridWeeks.map((week, weekIdx) => (
                  <div key={`wk-${weekIdx}`} className="flex flex-col gap-1">
                    {week.map((day) => (
                      <Tooltip key={day.dateStr}>
                        <TooltipTrigger asChild>
                          <div
                            className={`h-2.5 w-2.5 rounded-sm transition-all duration-200 cursor-pointer ${getCellColor(
                              day.count
                            )}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <span className="font-semibold">{day.count} submissions</span>
                          <span className="text-muted-foreground block text-[10px]">
                            {format(day.date, "EEEE, MMMM d, yyyy")}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend Footer */}
            <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-muted-foreground mr-4">
              <span>Less</span>
              <div className="h-2.5 w-2.5 rounded-sm bg-muted/40 border border-border/10" />
              <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500/20" />
              <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500/40" />
              <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500/70" />
              <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
