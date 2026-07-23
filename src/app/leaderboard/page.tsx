import type { Metadata } from "next";
import { LeaderboardDashboard } from "@/components/leaderboard/leaderboard-dashboard";

export const metadata: Metadata = {
  title: "Leaderboard | LeetCode Progress Explorer",
  description:
    "See how your favorite LeetCode users rank against each other.",
};

export default function LeaderboardPage() {
  return <LeaderboardDashboard />;
}
