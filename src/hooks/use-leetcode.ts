"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  getUserSolved,
  getUserContest,
  getUserContestHistory,
  getUserCalendar,
  getUserBadges,
  getUserSubmissions,
} from "@/services/leetcode";
import { CACHE_DURATIONS } from "@/constants";

// ============================================================
// TanStack Query Hooks for LeetCode API
// ============================================================

/** Hook to fetch user profile */
export function useUserProfile(username: string | undefined) {
  return useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => getUserProfile(username!),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 2,
  });
}

/** Hook to fetch solved stats */
export function useUserSolved(username: string | undefined) {
  return useQuery({
    queryKey: ["userSolved", username],
    queryFn: () => getUserSolved(username!),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 2,
  });
}

/** Hook to fetch contest info */
export function useUserContest(username: string | undefined) {
  return useQuery({
    queryKey: ["userContest", username],
    queryFn: () => getUserContest(username!),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 1,
  });
}

/** Hook to fetch contest history */
export function useUserContestHistory(username: string | undefined) {
  return useQuery({
    queryKey: ["userContestHistory", username],
    queryFn: () => getUserContestHistory(username!),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 1,
  });
}

/** Hook to fetch submission calendar */
export function useUserCalendar(username: string | undefined) {
  return useQuery({
    queryKey: ["userCalendar", username],
    queryFn: () => getUserCalendar(username!),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 2,
  });
}

/** Hook to fetch badges */
export function useUserBadges(username: string | undefined) {
  return useQuery({
    queryKey: ["userBadges", username],
    queryFn: () => getUserBadges(username!),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 1,
  });
}

/** Hook to fetch recent submissions */
export function useUserSubmissions(
  username: string | undefined,
  limit: number = 20
) {
  return useQuery({
    queryKey: ["userSubmissions", username, limit],
    queryFn: () => getUserSubmissions(username!, limit),
    enabled: !!username,
    staleTime: CACHE_DURATIONS.staleTime,
    gcTime: CACHE_DURATIONS.gcTime,
    retry: 1,
  });
}
