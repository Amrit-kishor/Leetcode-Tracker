import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics | LeetCode Progress Explorer",
  description:
    "Analyze your LeetCode performance with detailed scores and insights.",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
