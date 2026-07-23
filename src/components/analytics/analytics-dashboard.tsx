"use client";

import { useState, useCallback, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  BarChart3,
  Target,
  Trophy,
  Scale,
  Star,
  TrendingUp,
  Lightbulb,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserSolved, getUserContest, getUserCalendar } from "@/services/leetcode";
import { calculateAnalyticsScores } from "@/utils/calculations";
import type { SolvedStats, ContestInfo, SubmissionCalendar, AnalyticsScores } from "@/types/leetcode";

// Dynamic imports for chart components (no SSR for Recharts)
const ProgressRing = dynamic(
  () => import("@/components/charts/progress-ring"),
  { ssr: false }
);
const AnalyticsRadarChart = dynamic(
  () => import("@/components/charts/radar-chart"),
  { ssr: false }
);

// ============================================================
// Score card configuration
// ============================================================

interface ScoreCardConfig {
  key: keyof Pick<
    AnalyticsScores,
    "codingScore" | "consistencyScore" | "contestScore" | "difficultyBalance" | "overallScore"
  >;
  label: string;
  color: string;
  icon: React.ReactNode;
  gradient: string;
}

const SCORE_CARDS: ScoreCardConfig[] = [
  {
    key: "codingScore",
    label: "Coding Score",
    color: "#6366f1",
    icon: <BarChart3 className="size-4" />,
    gradient: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    key: "consistencyScore",
    label: "Consistency",
    color: "#06b6d4",
    icon: <Target className="size-4" />,
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
  {
    key: "contestScore",
    label: "Contest Score",
    color: "#f59e0b",
    icon: <Trophy className="size-4" />,
    gradient: "from-amber-500/20 to-amber-600/5",
  },
  {
    key: "difficultyBalance",
    label: "Balance",
    color: "#8b5cf6",
    icon: <Scale className="size-4" />,
    gradient: "from-violet-500/20 to-violet-600/5",
  },
  {
    key: "overallScore",
    label: "Overall",
    color: "#ec4899",
    icon: <Star className="size-4" />,
    gradient: "from-pink-500/20 to-pink-600/5",
  },
];

// ============================================================
// Recommendation helpers
// ============================================================

interface Recommendation {
  id: string;
  text: string;
  icon: React.ReactNode;
  priority: "high" | "medium" | "low";
}

function getRecommendations(scores: AnalyticsScores): Recommendation[] {
  const recs: Recommendation[] = [];

  if (scores.codingScore < 50) {
    recs.push({
      id: "more-problems",
      text: "Solve more problems to improve your coding score. Aim for at least 2-3 problems per day.",
      icon: <BarChart3 className="size-4 text-indigo-500" />,
      priority: "high",
    });
  }

  if (scores.consistencyScore < 40) {
    recs.push({
      id: "consistency",
      text: "Build a daily coding habit. Even solving one easy problem a day boosts your consistency score.",
      icon: <Target className="size-4 text-cyan-500" />,
      priority: "high",
    });
  }

  if (scores.contestScore < 30) {
    recs.push({
      id: "contests",
      text: "Participate in weekly contests to improve your contest rating and problem-solving speed.",
      icon: <Trophy className="size-4 text-amber-500" />,
      priority: "medium",
    });
  }

  if (scores.difficultyBalance < 50) {
    recs.push({
      id: "balance",
      text: "Diversify the difficulty of problems you solve. Aim for a balanced mix of easy, medium, and hard.",
      icon: <Scale className="size-4 text-violet-500" />,
      priority: "medium",
    });
  }

  if (scores.overallScore >= 70) {
    recs.push({
      id: "great-job",
      text: "Great work! Keep pushing your limits with harder problems and competitive programming.",
      icon: <TrendingUp className="size-4 text-emerald-500" />,
      priority: "low",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "keep-going",
      text: "You're doing well! Keep up the momentum and challenge yourself with new topics.",
      icon: <Lightbulb className="size-4 text-amber-500" />,
      priority: "low",
    });
  }

  return recs;
}

// ============================================================
// Main Component
// ============================================================

export function AnalyticsDashboard() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<AnalyticsScores | null>(null);
  const [solvedData, setSolvedData] = useState<SolvedStats | null>(null);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const trimmed = username.trim();
      if (!trimmed) return;

      setIsLoading(true);
      setError(null);
      setScores(null);
      setSolvedData(null);

      try {
        const [solved, contest, calendar] = await Promise.allSettled([
          getUserSolved(trimmed),
          getUserContest(trimmed),
          getUserCalendar(trimmed),
        ]);

        if (solved.status === "rejected") {
          throw new Error("User not found or API error. Please check the username.");
        }

        const solvedResult = solved.value;
        const contestResult: ContestInfo | null =
          contest.status === "fulfilled" ? contest.value : null;
        const calendarResult: SubmissionCalendar | null =
          calendar.status === "fulfilled" ? calendar.value : null;

        const analyticsScores = calculateAnalyticsScores(
          solvedResult,
          contestResult,
          calendarResult
        );

        setSolvedData(solvedResult);
        setScores(analyticsScores);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [username]
  );

  const radarData = scores
    ? [
        { category: "Coding", value: scores.codingScore, fullMark: 100 },
        { category: "Consistency", value: scores.consistencyScore, fullMark: 100 },
        { category: "Contest", value: scores.contestScore, fullMark: 100 },
        { category: "Balance", value: scores.difficultyBalance, fullMark: 100 },
      ]
    : [];

  const recommendations = scores ? getRecommendations(scores) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Enter a LeetCode username to view detailed performance analytics.
        </p>
      </motion.div>

      {/* Search */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter LeetCode username…"
            className="h-10 pl-9"
            aria-label="LeetCode username"
          />
        </div>
        <Button type="submit" disabled={isLoading || !username.trim()} size="lg">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Analyze"
          )}
        </Button>
      </motion.form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 py-16"
          >
            <Loader2 className="size-8 animate-spin text-indigo-500" />
            <p className="text-sm text-muted-foreground">
              Crunching the numbers…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {scores && solvedData && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Skill level & percentile badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Badge
                variant="outline"
                className="h-7 gap-1.5 border-indigo-500/30 bg-indigo-500/10 px-3 text-sm text-indigo-600 dark:text-indigo-400"
              >
                <Star className="size-3.5" />
                {scores.skillLevel}
              </Badge>
              <Badge
                variant="outline"
                className="h-7 gap-1.5 border-purple-500/30 bg-purple-500/10 px-3 text-sm text-purple-600 dark:text-purple-400"
              >
                <TrendingUp className="size-3.5" />
                Top {100 - scores.percentile}%
              </Badge>
              <span className="text-sm text-muted-foreground">
                {solvedData.solvedProblem} problems solved
              </span>
            </motion.div>

            {/* Score Cards Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {SCORE_CARDS.map((card, i) => (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  <Card
                    className={`relative overflow-hidden border-0 bg-gradient-to-br ${card.gradient} backdrop-blur-sm ring-1 ring-white/10`}
                  >
                    <CardContent className="flex flex-col items-center gap-3 pt-5 pb-4">
                      <ProgressRing
                        value={scores[card.key]}
                        size={80}
                        strokeWidth={6}
                        color={card.color}
                        label={`/ 100`}
                      />
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        {card.icon}
                        {card.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Radar chart + Recommendations */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Card className="border-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm ring-1 ring-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="size-4 text-indigo-500" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsRadarChart data={radarData} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <Card className="border-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 backdrop-blur-sm ring-1 ring-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="size-4 text-amber-500" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {recommendations.map((rec, i) => (
                        <motion.li
                          key={rec.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-0.5 shrink-0 rounded-lg bg-muted p-1.5">
                            {rec.icon}
                          </span>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {rec.text}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
