import {
  type SolvedStats,
  type SubmissionCalendar,
  type ContestInfo,
  type CalendarDay,
  type AnalyticsScores,
} from "@/types/leetcode";
import { TOTAL_LEETCODE_PROBLEMS, SKILL_LEVELS } from "@/constants";

// ============================================================
// Calendar Data Parsing
// ============================================================

/** Parse submission calendar string to structured data */
export function parseSubmissionCalendar(
  calendar: string | Record<string, number>
): CalendarDay[] {
  let data: Record<string, number>;

  if (typeof calendar === "string") {
    try {
      data = JSON.parse(calendar);
    } catch {
      return [];
    }
  } else {
    data = calendar;
  }

  return Object.entries(data)
    .map(([timestamp, count]) => ({
      date: new Date(parseInt(timestamp) * 1000).toISOString().split("T")[0],
      count,
      timestamp: parseInt(timestamp),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

// ============================================================
// Streak Calculations
// ============================================================

/** Calculate current streak from calendar data */
export function calculateCurrentStreak(calendarDays: CalendarDay[]): number {
  if (calendarDays.length === 0) return 0;

  const sorted = [...calendarDays]
    .filter((d) => d.count > 0)
    .sort((a, b) => b.timestamp - a.timestamp);

  if (sorted.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = Math.floor(today.getTime() / 1000);

  const lastDay = sorted[0];
  const lastDayDate = new Date(lastDay.timestamp * 1000);
  lastDayDate.setHours(0, 0, 0, 0);
  const lastDayTs = Math.floor(lastDayDate.getTime() / 1000);

  // If last submission was more than 1 day ago, streak is 0
  const dayDiff = (todayTs - lastDayTs) / 86400;
  if (dayDiff > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i - 1].timestamp * 1000);
    const prev = new Date(sorted[i].timestamp * 1000);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/** Calculate longest streak from calendar data */
export function calculateLongestStreak(calendarDays: CalendarDay[]): number {
  const activeDays = calendarDays
    .filter((d) => d.count > 0)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (activeDays.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < activeDays.length; i++) {
    const curr = new Date(activeDays[i].timestamp * 1000);
    const prev = new Date(activeDays[i - 1].timestamp * 1000);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

// ============================================================
// Acceptance Rate
// ============================================================

/** Calculate acceptance rate from solved stats */
export function calculateAcceptanceRate(solved: SolvedStats): number {
  const totalSubmissions =
    solved.totalSubmissionNum.find((s) => s.difficulty === "All")?.submissions ??
    0;
  const acceptedSubmissions =
    solved.acSubmissionNum.find((s) => s.difficulty === "All")?.submissions ?? 0;

  if (totalSubmissions === 0) return 0;
  return Math.round((acceptedSubmissions / totalSubmissions) * 10000) / 100;
}

/** Get total submissions count */
export function getTotalSubmissions(solved: SolvedStats): number {
  return (
    solved.totalSubmissionNum.find((s) => s.difficulty === "All")
      ?.submissions ?? 0
  );
}

// ============================================================
// Analytics Score Calculations
// ============================================================

/** Calculate comprehensive analytics scores */
export function calculateAnalyticsScores(
  solved: SolvedStats,
  contest: ContestInfo | null,
  calendar: SubmissionCalendar | null
): AnalyticsScores {
  // Coding Score (0-100): weighted by difficulty
  const easyWeight = 1;
  const mediumWeight = 3;
  const hardWeight = 5;
  const maxCodingPoints =
    TOTAL_LEETCODE_PROBLEMS.easy * easyWeight +
    TOTAL_LEETCODE_PROBLEMS.medium * mediumWeight +
    TOTAL_LEETCODE_PROBLEMS.hard * hardWeight;
  const codingPoints =
    solved.easySolved * easyWeight +
    solved.mediumSolved * mediumWeight +
    solved.hardSolved * hardWeight;
  const codingScore = Math.min(
    100,
    Math.round((codingPoints / maxCodingPoints) * 100 * 5)
  );

  // Consistency Score (0-100): based on active days and streak
  const activeDays = calendar?.totalActiveDays ?? 0;
  const streak = calendar?.streak ?? 0;
  const consistencyScore = Math.min(
    100,
    Math.round((activeDays / 365) * 50 + (streak / 30) * 50)
  );

  // Contest Score (0-100): based on contest rating
  const contestRating = contest?.contestRating ?? 0;
  const contestScore = Math.min(100, Math.round((contestRating / 3000) * 100));

  // Difficulty Balance (0-100): how balanced the solved distribution is
  const total = solved.solvedProblem || 1;
  const easyRatio = solved.easySolved / total;
  const mediumRatio = solved.mediumSolved / total;
  const hardRatio = solved.hardSolved / total;
  // Ideal ratio: 25% easy, 50% medium, 25% hard
  const idealEasy = 0.25;
  const idealMedium = 0.5;
  const idealHard = 0.25;
  const balanceDeviation =
    Math.abs(easyRatio - idealEasy) +
    Math.abs(mediumRatio - idealMedium) +
    Math.abs(hardRatio - idealHard);
  const difficultyBalance = Math.max(
    0,
    Math.round((1 - balanceDeviation) * 100)
  );

  // Overall Score (weighted average)
  const overallScore = Math.round(
    codingScore * 0.35 +
      consistencyScore * 0.25 +
      contestScore * 0.25 +
      difficultyBalance * 0.15
  );

  // Percentile estimation
  const percentile = Math.min(
    99,
    Math.round(50 + (solved.solvedProblem / 500) * 30 + (contestRating / 2000) * 20)
  );

  // Skill level
  const skillLevel =
    SKILL_LEVELS.find(
      (l) => solved.solvedProblem >= l.min && solved.solvedProblem <= l.max
    )?.label ?? "Beginner";

  return {
    codingScore,
    consistencyScore,
    contestScore,
    difficultyBalance,
    overallScore,
    percentile,
    skillLevel,
  };
}

// ============================================================
// Utility Helpers
// ============================================================

/** Format large numbers with K/M suffix */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/** Calculate completion percentage */
export function calculateCompletion(
  solved: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((solved / total) * 10000) / 100;
}

/** Get ordinal suffix for a number (1st, 2nd, 3rd, etc.) */
export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
