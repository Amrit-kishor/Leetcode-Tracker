// ============================================================
// Application Constants
// ============================================================

/** Total problems on LeetCode (approximate, updated periodically) */
export const TOTAL_LEETCODE_PROBLEMS = {
  total: 3300,
  easy: 830,
  medium: 1740,
  hard: 730,
};

/** Difficulty color palette */
export const DIFFICULTY_COLORS = {
  easy: { bg: "#10b981", light: "#d1fae5", text: "#065f46" },
  medium: { bg: "#f59e0b", light: "#fef3c7", text: "#92400e" },
  hard: { bg: "#ef4444", light: "#fee2e2", text: "#991b1b" },
} as const;

/** Chart color palette */
export const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  tertiary: "#06b6d4",
  quaternary: "#ec4899",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  muted: "#94a3b8",
} as const;

/** Comparison user colors */
export const COMPARISON_COLORS = [
  "#6366f1",
  "#ec4899",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
] as const;

/** Navigation items */
export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Compare", href: "/compare", icon: "GitCompareArrows" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Favorites", href: "/favorites", icon: "Heart" },
] as const;

/** Skill level thresholds */
export const SKILL_LEVELS = [
  { min: 0, max: 50, label: "Beginner", color: "#94a3b8" },
  { min: 51, max: 150, label: "Intermediate", color: "#06b6d4" },
  { min: 151, max: 350, label: "Advanced", color: "#8b5cf6" },
  { min: 351, max: 700, label: "Expert", color: "#f59e0b" },
  { min: 701, max: 1500, label: "Master", color: "#ef4444" },
  { min: 1501, max: Infinity, label: "Grandmaster", color: "#ec4899" },
] as const;

/** Max search history entries */
export const MAX_SEARCH_HISTORY = 10;

/** Max comparison users */
export const MAX_COMPARISON_USERS = 5;
export const MIN_COMPARISON_USERS = 2;

/** API cache durations (ms) */
export const CACHE_DURATIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
} as const;

/** Animation duration presets */
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;
