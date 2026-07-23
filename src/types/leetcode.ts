// ============================================================
// LeetCode API Response Types
// Based on alfa-leetcode-api (https://github.com/alfaarghya/alfa-leetcode-api)
// ============================================================

/** Basic user profile from /:username */
export interface UserProfile {
  username: string;
  name: string;
  birthday: string | null;
  avatar: string;
  ranking: number;
  reputation: number;
  gitHub: string | null;
  twitter: string | null;
  linkedIN: string | null;
  website: string[];
  country: string | null;
  company: string | null;
  school: string | null;
  skillTags: string[];
  about: string;
}

/** Submission count by difficulty */
export interface SubmissionCount {
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  count: number;
  submissions: number;
}

/** Solved problems stats from /:username/solved */
export interface SolvedStats {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissionNum: SubmissionCount[];
  acSubmissionNum: SubmissionCount[];
}

/** Contest badge */
export interface ContestBadge {
  name: string;
  expired: boolean;
  hoverText: string;
  icon: string;
}

/** Contest ranking from /:username/contest */
export interface ContestInfo {
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number;
  totalParticipants: number;
  contestTopPercentage: number;
  contestBadges: ContestBadge | null;
}

/** Single contest entry in history */
export interface ContestHistoryEntry {
  attended: boolean;
  trendDirection: "UP" | "DOWN" | "";
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  rating: number;
  ranking: number;
  contest: {
    title: string;
    startTime: number;
  };
}

/** Contest history from /:username/contest/history */
export interface ContestHistory {
  contestHistory: ContestHistoryEntry[];
}

/** Submission calendar from /:username/calendar */
export interface SubmissionCalendar {
  submissionCalendar: string | Record<string, number>;
  totalActiveDays: number;
  streak: number;
  dccBadges: Badge[];
}

/** Badge from /:username/badges */
export interface Badge {
  id: string;
  displayName: string;
  icon: string;
  creationDate: string;
}

/** Badges response */
export interface UserBadges {
  badges: Badge[];
  upcomingBadges: {
    name: string;
    icon: string;
  }[];
  activeBadge: Badge | null;
}

/** Single submission */
export interface Submission {
  title: string;
  titleSlug: string;
  timestamp: string;
  statusDisplay: string;
  lang: string;
}

/** Submissions response */
export interface SubmissionResponse {
  submission: Submission[];
}

// ============================================================
// App-level types
// ============================================================

/** Parsed calendar data for heatmap */
export interface CalendarDay {
  date: string;
  count: number;
  timestamp: number;
}

/** User comparison entry */
export interface ComparisonUser {
  username: string;
  profile: UserProfile | null;
  solved: SolvedStats | null;
  contest: ContestInfo | null;
  calendar: SubmissionCalendar | null;
  isLoading: boolean;
  error: string | null;
}

/** Insight generated from user data */
export interface Insight {
  id: string;
  type: "strength" | "improvement" | "info" | "achievement";
  title: string;
  description: string;
  icon: string;
}

/** Analytics scores */
export interface AnalyticsScores {
  codingScore: number;
  consistencyScore: number;
  contestScore: number;
  difficultyBalance: number;
  overallScore: number;
  percentile: number;
  skillLevel: string;
}

/** Favorite user entry */
export interface FavoriteUser {
  username: string;
  avatar?: string;
  name?: string;
  totalSolved?: number;
  addedAt: number;
}

/** Search history entry */
export interface SearchHistoryEntry {
  username: string;
  timestamp: number;
}
