import type { Metadata } from "next";
import { ComparisonDashboard } from "@/components/comparison/comparison-dashboard";

export const metadata: Metadata = {
  title: "Compare Users | LeetCode Progress Explorer",
};

export default function ComparePage() {
  return <ComparisonDashboard />;
}
