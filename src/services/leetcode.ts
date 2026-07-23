import { apiClient } from "./api";
import type {
  UserProfile,
  SolvedStats,
  ContestInfo,
  ContestHistory,
  SubmissionCalendar,
  UserBadges,
  SubmissionResponse,
} from "@/types/leetcode";

// ============================================================
// LeetCode API Service Layer
// Never call APIs directly from components — always use these.
// ============================================================

/** Get user profile */
export async function getUserProfile(
  username: string
): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>(`/${username}`);
  return data;
}

/** Get solved problems statistics */
export async function getUserSolved(
  username: string
): Promise<SolvedStats> {
  const { data } = await apiClient.get<SolvedStats>(`/${username}/solved`);
  return data;
}

/** Get contest ranking information */
export async function getUserContest(
  username: string
): Promise<ContestInfo> {
  const { data } = await apiClient.get<ContestInfo>(`/${username}/contest`);
  return data;
}

/** Get full contest history */
export async function getUserContestHistory(
  username: string
): Promise<ContestHistory> {
  const { data } = await apiClient.get<ContestHistory>(
    `/${username}/contest/history`
  );
  return data;
}

/** Get submission calendar (heatmap data) */
export async function getUserCalendar(
  username: string
): Promise<SubmissionCalendar> {
  const { data } = await apiClient.get<SubmissionCalendar>(
    `/${username}/calendar`
  );
  return data;
}

/** Get user badges */
export async function getUserBadges(
  username: string
): Promise<UserBadges> {
  const { data } = await apiClient.get<UserBadges>(`/${username}/badges`);
  return data;
}

/** Get recent submissions */
export async function getUserSubmissions(
  username: string,
  limit: number = 20
): Promise<SubmissionResponse> {
  const { data } = await apiClient.get<SubmissionResponse>(
    `/${username}/submission`,
    { params: { limit } }
  );
  return data;
}

/** Get recent accepted submissions */
export async function getUserAcceptedSubmissions(
  username: string,
  limit: number = 20
): Promise<SubmissionResponse> {
  const { data } = await apiClient.get<SubmissionResponse>(
    `/${username}/acSubmission`,
    { params: { limit } }
  );
  return data;
}
