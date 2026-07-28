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
// Local Session Caching Layer
// ============================================================

interface CacheEntry {
  data: any;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime

function getSessionCache(key: string): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`api_cache:${key}`);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(`api_cache:${key}`);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setSessionCache(key: string, data: any): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    sessionStorage.setItem(`api_cache:${key}`, JSON.stringify(entry));
  } catch {}
}

/** Wrapper function that fetches data with session storage caching */
async function getCached<T>(url: string, params?: any): Promise<T> {
  const cacheKey = `${url}${params ? "?" + JSON.stringify(params) : ""}`;
  const cached = getSessionCache(cacheKey);
  if (cached) {
    return cached as T;
  }
  const { data } = await apiClient.get<T>(url, { params });
  setSessionCache(cacheKey, data);
  return data;
}

// ============================================================
// LeetCode API Service Layer
// ============================================================

/** Get user profile */
export async function getUserProfile(
  username: string
): Promise<UserProfile> {
  return getCached<UserProfile>(`/${username}`);
}

/** Get solved problems statistics */
export async function getUserSolved(
  username: string
): Promise<SolvedStats> {
  return getCached<SolvedStats>(`/${username}/solved`);
}

/** Get contest ranking information */
export async function getUserContest(
  username: string
): Promise<ContestInfo> {
  return getCached<ContestInfo>(`/${username}/contest`);
}

/** Get full contest history */
export async function getUserContestHistory(
  username: string
): Promise<ContestHistory> {
  return getCached<ContestHistory>(`/${username}/contest/history`);
}

/** Get submission calendar (heatmap data) */
export async function getUserCalendar(
  username: string
): Promise<SubmissionCalendar> {
  return getCached<SubmissionCalendar>(`/${username}/calendar`);
}

/** Get user badges */
export async function getUserBadges(
  username: string
): Promise<UserBadges> {
  return getCached<UserBadges>(`/${username}/badges`);
}

/** Get recent submissions */
export async function getUserSubmissions(
  username: string,
  limit: number = 20
): Promise<SubmissionResponse> {
  return getCached<SubmissionResponse>(`/${username}/submission`, { limit });
}

/** Get recent accepted submissions */
export async function getUserAcceptedSubmissions(
  username: string,
  limit: number = 20
): Promise<SubmissionResponse> {
  return getCached<SubmissionResponse>(`/${username}/acSubmission`, { limit });
}
