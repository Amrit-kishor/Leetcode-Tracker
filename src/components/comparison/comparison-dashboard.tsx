"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, GitCompareArrows, Loader2, Users, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getUserProfile,
  getUserSolved,
  getUserContest,
  getUserCalendar,
} from "@/services/leetcode";
import { generateComparisonSummary } from "@/utils/insights";
import {
  COMPARISON_COLORS,
  MAX_COMPARISON_USERS,
  MIN_COMPARISON_USERS,
} from "@/constants";
import { ComparisonTable } from "./comparison-table";
import type { ComparisonUserData } from "./comparison-table";
import { ComparisonCharts } from "./comparison-charts";
import { exportToCSV } from "@/utils/export";
import { calculateAcceptanceRate } from "@/utils/calculations";
import { toast } from "sonner";

// ============================================================
// Loading Skeleton
// ============================================================

function ComparisonSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-6">
          <div className="space-y-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-[350px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-[350px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// Main Dashboard
// ============================================================

export function ComparisonDashboard() {
  const [usernames, setUsernames] = useState<string[]>(["", ""]);
  const [comparing, setComparing] = useState(false);
  const [usersData, setUsersData] = useState<ComparisonUserData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ------- Username Management -------

  const addUsername = useCallback(() => {
    if (usernames.length >= MAX_COMPARISON_USERS) return;
    setUsernames((prev) => [...prev, ""]);
  }, [usernames.length]);

  const removeUsername = useCallback(
    (index: number) => {
      if (usernames.length <= MIN_COMPARISON_USERS) return;
      setUsernames((prev) => prev.filter((_, i) => i !== index));
    },
    [usernames.length]
  );

  const updateUsername = useCallback((index: number, value: string) => {
    setUsernames((prev) => prev.map((u, i) => (i === index ? value : u)));
  }, []);

  // ------- Fetch & Compare -------

  const handleCompare = useCallback(async () => {
    const trimmed = usernames
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (trimmed.length < MIN_COMPARISON_USERS) {
      setError(
        `Please enter at least ${MIN_COMPARISON_USERS} usernames to compare.`
      );
      return;
    }

    const uniqueNames = [...new Set(trimmed)];
    if (uniqueNames.length < trimmed.length) {
      setError("Please remove duplicate usernames.");
      return;
    }

    setError(null);
    setComparing(true);
    setUsersData(null);

    try {
      const results = await Promise.all(
        uniqueNames.map(async (username) => {
          const [profile, solved, contest, calendar] =
            await Promise.allSettled([
              getUserProfile(username),
              getUserSolved(username),
              getUserContest(username),
              getUserCalendar(username),
            ]);

          return {
            username,
            profile:
              profile.status === "fulfilled" ? profile.value : null,
            solved:
              solved.status === "fulfilled" ? solved.value : null,
            contest:
              contest.status === "fulfilled" ? contest.value : null,
            calendar:
              calendar.status === "fulfilled" ? calendar.value : null,
          } satisfies ComparisonUserData;
        })
      );

      // Check if at least some data came back
      const hasData = results.some(
        (r) => r.profile || r.solved || r.contest || r.calendar
      );
      if (!hasData) {
        setError(
          "Could not fetch data for any user. Please check the usernames and try again."
        );
      } else {
        setUsersData(results);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setComparing(false);
    }
  }, [usernames]);

  const handleExportComparisonCSV = () => {
    if (!usersData) return;
    const headers = [
      "Metric",
      ...usersData.map((u) => u.username)
    ];

    const rows = [
      ["Total Solved", ...usersData.map((u) => u.solved?.solvedProblem ?? 0)],
      ["Easy Solved", ...usersData.map((u) => u.solved?.easySolved ?? 0)],
      ["Medium Solved", ...usersData.map((u) => u.solved?.mediumSolved ?? 0)],
      ["Hard Solved", ...usersData.map((u) => u.solved?.hardSolved ?? 0)],
      ["Acceptance Rate", ...usersData.map((u) => u.solved ? calculateAcceptanceRate(u.solved) + "%" : "0%")],
      ["Contest Rating", ...usersData.map((u) => u.contest ? Math.round(u.contest.contestRating) : "N/A")],
      ["Global Ranking", ...usersData.map((u) => u.profile?.ranking ?? "N/A")],
    ];

    exportToCSV(headers, rows, `leetcode_user_comparison`);
    toast.success("Comparison exported to CSV");
  };

  // ------- Comparison Summary -------

  const summaryLines = usersData
    ? generateComparisonSummary(
        usersData.map((u) => ({
          username: u.username,
          solved: u.solved,
          contest: u.contest,
        }))
      )
    : [];

  // ------- Render -------

  const canCompare =
    usernames.filter((u) => u.trim().length > 0).length >=
    MIN_COMPARISON_USERS;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
          <GitCompareArrows className="size-7 text-primary" aria-hidden />
          Compare Users
        </h1>
        <p className="text-muted-foreground">
          Compare LeetCode profiles side-by-side. Add 2–5 usernames to get
          started.
        </p>
      </motion.div>

      {/* Username Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4" aria-hidden />
              Usernames
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Username Rows */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {usernames.map((username, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    {/* Color indicator */}
                    <span
                      className="hidden size-3 shrink-0 rounded-full sm:block"
                      style={{
                        backgroundColor:
                          COMPARISON_COLORS[index % COMPARISON_COLORS.length],
                      }}
                      aria-hidden
                    />
                    <div className="relative flex-1">
                      <Input
                        value={username}
                        onChange={(e) =>
                          updateUsername(index, e.target.value)
                        }
                        placeholder={`Username ${index + 1}`}
                        className="h-10 pr-9 font-mono"
                        aria-label={`Username ${index + 1}`}
                      />
                      {usernames.length > MIN_COMPARISON_USERS && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUsername(index)}
                          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove user ${index + 1}`}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {usernames.length < MAX_COMPARISON_USERS && (
                <Button
                  variant="outline"
                  onClick={addUsername}
                  disabled={comparing}
                  className="w-full sm:w-auto"
                >
                  <Plus className="mr-1.5 size-4" /> Add User
                </Button>
              )}
              <Button
                onClick={handleCompare}
                disabled={comparing || !canCompare}
                className="w-full sm:w-auto sm:ml-auto"
              >
                {comparing ? (
                  <>
                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                    Comparing…
                  </>
                ) : (
                  <>Compare Profiles</>
                )}
              </Button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-sm font-medium text-destructive"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {comparing && <ComparisonSkeleton />}

      {/* Results */}
      <AnimatePresence>
        {usersData && !comparing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Summary Insights */}
            {summaryLines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle>Comparison Summary</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportComparisonCSV}
                      className="cursor-pointer"
                    >
                      <Download className="mr-1.5 h-4 w-4" /> Export CSV
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {summaryLines.map((line, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.25,
                            delay: 0.15 + i * 0.08,
                          }}
                          className="text-sm leading-relaxed text-foreground"
                        >
                          {line}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Table */}
            <ComparisonTable users={usersData} />

            {/* Charts */}
            <ComparisonCharts users={usersData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
