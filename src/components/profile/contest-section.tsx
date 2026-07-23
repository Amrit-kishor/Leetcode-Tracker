"use client";

import dynamic from "next/dynamic";
import { format } from "date-fns";
import { Trophy, TrendingUp, TrendingDown, Users, AlertCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContestInfo, ContestHistory } from "@/types/leetcode";

const ContestAreaChart = dynamic(
  () => import("@/components/charts/contest-area-chart"),
  { ssr: false }
);

interface ContestSectionProps {
  contest: ContestInfo | null;
  contestHistory: ContestHistory | null;
  isLoading: boolean;
}

export function ContestSection({ contest, contestHistory, isLoading }: ContestSectionProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl md:col-span-2 lg:col-span-3" />
      </div>
    );
  }

  // Handle case where user hasn't participated in any contests
  const attendedCount = contest?.contestAttend ?? 0;
  if (attendedCount === 0 || !contestHistory?.contestHistory?.length) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <Trophy className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">No Contest History</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            This user hasn't participated in any weekly or biweekly LeetCode contests yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get active contest list
  const activeContests = contestHistory.contestHistory.filter((c) => c.attended);

  // Parse chart data (keep chronological order)
  const chartData = activeContests.map((c) => ({
    contest: c.contest.title.replace("Weekly Contest ", "W").replace("Biweekly Contest ", "B"),
    rating: Math.round(c.rating),
    ranking: c.ranking,
  }));

  // Calculate highest rating and rank from history
  const maxRating = Math.max(...activeContests.map((c) => c.rating), 0);
  const bestRank = Math.min(...activeContests.map((c) => c.ranking), Infinity);

  // Get latest contest details
  const latestContest = activeContests[activeContests.length - 1];

  return (
    <div className="space-y-6">
      {/* Contest Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Rating */}
        <Card className="border-border/50 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Contest Rating
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold flex items-baseline gap-2">
              {contest?.contestRating ? Math.round(contest.contestRating).toLocaleString() : "N/A"}
              {latestContest && latestContest.trendDirection && (
                <span className="flex items-center text-xs font-semibold">
                  {latestContest.trendDirection === "UP" ? (
                    <span className="text-emerald-500 flex items-center">
                      <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> UP
                    </span>
                  ) : latestContest.trendDirection === "DOWN" ? (
                    <span className="text-red-500 flex items-center">
                      <TrendingDown className="h-3.5 w-3.5 mr-0.5" /> DOWN
                    </span>
                  ) : null}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>Peak: {Math.round(maxRating).toLocaleString()}</span>
              {contest?.contestBadges && (
                <span className="ml-1 text-xs">🏅 {contest.contestBadges.name}</span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Global Rank */}
        <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Global Ranking
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {contest?.contestGlobalRanking ? `#${contest.contestGlobalRanking.toLocaleString()}` : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Top {contest?.contestTopPercentage ? `${contest.contestTopPercentage.toFixed(2)}%` : "N/A"} of participants
            </p>
          </CardContent>
        </Card>

        {/* Best Contest Rank */}
        <Card className="border-border/50 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Best Contest Rank
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">
              {bestRank !== Infinity ? `#${bestRank.toLocaleString()}` : "N/A"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Best finish out of {attendedCount} contests
            </p>
          </CardContent>
        </Card>

        {/* Contests Attended */}
        <Card className="border-border/50 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider">
              Contests Played
            </CardDescription>
            <CardTitle className="text-3xl font-extrabold">{attendedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> Total participants: {contest?.totalParticipants?.toLocaleString() || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contest Rating Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Rating Trajectory</CardTitle>
          <CardDescription>
            Historical contest rating progression over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ContestAreaChart data={chartData} />
        </CardContent>
      </Card>

      {/* Contest History Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Contest Participation History</CardTitle>
          <CardDescription>Detailed results for all contests attended.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                <th className="p-4">Contest</th>
                <th className="p-4">Rank</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Solved</th>
                <th className="p-4">Finish Time</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {[...activeContests]
                .reverse()
                .slice(0, 10) // Show last 10 contests
                .map((entry, idx) => {
                  const dateStr = format(new Date(entry.contest.startTime * 1000), "MMM d, yyyy");
                  const ratingVal = Math.round(entry.rating);
                  const durationMins = Math.floor(entry.finishTimeInSeconds / 60);

                  return (
                    <tr
                      key={entry.contest.startTime}
                      className="border-b border-border/40 hover:bg-muted/10 transition-colors"
                    >
                      <td className="p-4 font-medium text-foreground">
                        {entry.contest.title}
                      </td>
                      <td className="p-4 tabular-nums">
                        #{entry.ranking.toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold tabular-nums">
                        {ratingVal}
                      </td>
                      <td className="p-4 tabular-nums">
                        {entry.problemsSolved} / {entry.totalProblems}
                      </td>
                      <td className="p-4 tabular-nums">
                        {entry.problemsSolved > 0 ? `${durationMins}m` : "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">{dateStr}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {activeContests.length > 10 && (
            <p className="text-xs text-muted-foreground text-center py-3 border-t border-border/30">
              Showing the 10 most recent contests.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
