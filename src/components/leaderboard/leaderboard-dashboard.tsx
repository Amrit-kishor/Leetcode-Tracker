"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Trophy,
  Medal,
  Crown,
  Users,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/app-store";
import { useUserSolved } from "@/hooks/use-leetcode";
import type { SolvedStats } from "@/types/leetcode";

// ============================================================
// LeaderboardRow — each row calls useUserSolved internally
// ============================================================

interface LeaderboardRowProps {
  username: string;
  /** Called once data arrives so parent can sort */
  onDataLoaded: (username: string, solved: SolvedStats) => void;
}

function LeaderboardRow({ username, onDataLoaded }: LeaderboardRowProps) {
  const { data, isLoading, isError } = useUserSolved(username);

  // Report data upward once resolved
  useMemo(() => {
    if (data) onDataLoaded(username, data);
  }, [data, username, onDataLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{username}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
        <span className="text-sm text-muted-foreground line-through">
          {username}
        </span>
        <span className="text-xs text-destructive">Failed to load</span>
      </div>
    );
  }

  // Row is rendered; actual placement handled by parent sort
  return null;
}

// ============================================================
// Sorted leaderboard entry (rendered after sorting)
// ============================================================

interface SortedEntry {
  username: string;
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return <Crown className="size-5 text-amber-400" aria-label="1st place" />;
  if (rank === 2)
    return <Medal className="size-5 text-slate-400" aria-label="2nd place" />;
  if (rank === 3)
    return <Medal className="size-5 text-amber-600" aria-label="3rd place" />;
  return (
    <span className="flex size-5 items-center justify-center text-xs font-semibold text-muted-foreground">
      {rank}
    </span>
  );
}

// ============================================================
// Main Component
// ============================================================

export function LeaderboardDashboard() {
  const favorites = useAppStore((s) => s.favorites);
  const searchHistory = useAppStore((s) => s.searchHistory);

  // Unique usernames from favorites + search history
  const usernames = useMemo(() => {
    const set = new Set<string>();
    favorites.forEach((f) => set.add(f.username));
    searchHistory.forEach((h) => set.add(h.username));
    return Array.from(set);
  }, [favorites, searchHistory]);

  // Collect solved data from individual row hooks
  const solvedMap = useMemo(() => new Map<string, SolvedStats>(), []);

  const handleDataLoaded = useMemo(
    () => (username: string, solved: SolvedStats) => {
      solvedMap.set(username, solved);
    },
    [solvedMap]
  );

  // Build sorted entries from the collected data
  const sortedEntries: SortedEntry[] = useMemo(() => {
    return usernames
      .map((u) => {
        const d = solvedMap.get(u);
        if (!d) return null;
        return {
          username: u,
          solvedProblem: d.solvedProblem,
          easySolved: d.easySolved,
          mediumSolved: d.mediumSolved,
          hardSolved: d.hardSolved,
        };
      })
      .filter((e): e is SortedEntry => e !== null)
      .sort((a, b) => b.solvedProblem - a.solvedProblem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernames, solvedMap.size]);

  const isEmpty = usernames.length === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Leaderboard
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Rankings from your favorites and search history.
        </p>
      </motion.div>

      {/* Empty state */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 py-20"
        >
          <div className="rounded-full bg-muted p-5">
            <Users className="size-10 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">No users to rank</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search for users or add favorites to populate the leaderboard.
            </p>
          </div>
        </motion.div>
      )}

      {/* Hidden data-fetcher rows (each calls useUserSolved) */}
      {usernames.map((u) => (
        <LeaderboardRow
          key={u}
          username={u}
          onDataLoaded={handleDataLoaded}
        />
      ))}

      {/* Sorted leaderboard table */}
      {sortedEntries.length > 0 && (
        <Card className="border-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 backdrop-blur-sm ring-1 ring-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4 text-amber-500" />
              Rankings
              <Badge variant="secondary" className="ml-auto">
                {sortedEntries.length} users
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sortedEntries.map((entry, i) => {
              const rank = i + 1;
              return (
                <motion.div
                  key={entry.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <Link
                    href={`/profile/${entry.username}`}
                    className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border/50 hover:bg-muted/50"
                  >
                    {/* Rank */}
                    <RankIcon rank={rank} />

                    {/* Avatar placeholder */}
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{
                        background: `hsl(${(entry.username.charCodeAt(0) * 37) % 360}, 60%, 50%)`,
                      }}
                      aria-hidden="true"
                    >
                      {entry.username.charAt(0).toUpperCase()}
                    </div>

                    {/* Name */}
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {entry.username}
                    </span>

                    {/* Difficulty badges */}
                    <div className="hidden items-center gap-1.5 sm:flex">
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      >
                        E {entry.easySolved}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      >
                        M {entry.mediumSolved}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
                      >
                        H {entry.hardSolved}
                      </Badge>
                    </div>

                    {/* Total solved */}
                    <span className="min-w-[3.5rem] text-right text-sm font-semibold tabular-nums">
                      {entry.solvedProblem}
                    </span>

                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
