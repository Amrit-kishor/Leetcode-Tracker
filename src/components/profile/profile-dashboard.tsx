"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import {
  useUserProfile,
  useUserSolved,
  useUserContest,
  useUserContestHistory,
  useUserCalendar,
  useUserBadges,
} from "@/hooks/use-leetcode";
import { useAppStore } from "@/stores/app-store";
import { UserHeader } from "./user-header";
import { StatCards } from "./stat-cards";
import { ContestSection } from "./contest-section";
import { SubmissionHeatmap } from "./submission-heatmap";
import { DifficultySection } from "./difficulty-section";
import { InsightsPanel } from "./insights-panel";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface ProfileDashboardProps {
  username: string;
}

export function ProfileDashboard({ username }: ProfileDashboardProps) {
  const { addSearch } = useAppStore();

  const profile = useUserProfile(username);
  const solved = useUserSolved(username);
  const contest = useUserContest(username);
  const contestHistory = useUserContestHistory(username);
  const calendar = useUserCalendar(username);
  const badges = useUserBadges(username);

  // Add to search history
  useEffect(() => {
    if (username) {
      addSearch(username);
    }
  }, [username, addSearch]);

  // Error state
  if (profile.error || solved.error) {
    const errMsg =
      (profile.error as Error)?.message ||
      (solved.error as Error)?.message ||
      "Failed to load profile";

    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title={
            errMsg.includes("not found")
              ? "User Not Found"
              : "Something Went Wrong"
          }
          description={
            errMsg.includes("not found")
              ? `The username "${username}" doesn't exist on LeetCode.`
              : errMsg
          }
          onRetry={() => {
            profile.refetch();
            solved.refetch();
          }}
        />
      </div>
    );
  }

  // Loading state
  if (profile.isLoading || solved.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile.data || !solved.data) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* User Header */}
      <motion.div variants={itemVariants}>
        <UserHeader
          profile={profile.data}
          solved={solved.data}
          badges={badges.data}
          username={username}
        />
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="mt-8">
        <StatCards solved={solved.data} badges={badges.data} />
      </motion.div>

      {/* Tabs for detailed sections */}
      <motion.div variants={itemVariants} className="mt-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DifficultySection solved={solved.data} />
          </TabsContent>

          <TabsContent value="contests" className="space-y-6">
            <ContestSection
              contest={contest.data ?? null}
              contestHistory={contestHistory.data ?? null}
              isLoading={contest.isLoading || contestHistory.isLoading}
            />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <SubmissionHeatmap calendar={calendar.data ?? null} isLoading={calendar.isLoading} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsPanel
              solved={solved.data}
              contest={contest.data ?? null}
              calendar={calendar.data ?? null}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
