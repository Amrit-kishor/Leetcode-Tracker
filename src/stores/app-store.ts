"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavoriteUser, SearchHistoryEntry } from "@/types/leetcode";
import { MAX_SEARCH_HISTORY } from "@/constants";

// ============================================================
// App Store (Zustand with persistence)
// ============================================================

interface AppState {
  // Search history
  searchHistory: SearchHistoryEntry[];
  addSearch: (username: string) => void;
  removeSearch: (username: string) => void;
  clearSearchHistory: () => void;

  // Favorites
  favorites: FavoriteUser[];
  addFavorite: (user: FavoriteUser) => void;
  removeFavorite: (username: string) => void;
  isFavorite: (username: string) => boolean;

  // Comparison users
  comparisonUsers: string[];
  addComparisonUser: (username: string) => void;
  removeComparisonUser: (username: string) => void;
  clearComparisonUsers: () => void;
  setComparisonUsers: (users: string[]) => void;

  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ---- Search History ----
      searchHistory: [],
      addSearch: (username: string) => {
        set((state) => {
          const filtered = state.searchHistory.filter(
            (s) => s.username.toLowerCase() !== username.toLowerCase()
          );
          const newEntry: SearchHistoryEntry = {
            username,
            timestamp: Date.now(),
          };
          return {
            searchHistory: [newEntry, ...filtered].slice(
              0,
              MAX_SEARCH_HISTORY
            ),
          };
        });
      },
      removeSearch: (username: string) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter(
            (s) => s.username !== username
          ),
        }));
      },
      clearSearchHistory: () => set({ searchHistory: [] }),

      // ---- Favorites ----
      favorites: [],
      addFavorite: (user: FavoriteUser) => {
        set((state) => {
          if (state.favorites.some((f) => f.username === user.username)) {
            return state;
          }
          return { favorites: [...state.favorites, user] };
        });
      },
      removeFavorite: (username: string) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => f.username !== username
          ),
        }));
      },
      isFavorite: (username: string) => {
        return get().favorites.some(
          (f) => f.username.toLowerCase() === username.toLowerCase()
        );
      },

      // ---- Comparison ----
      comparisonUsers: [],
      addComparisonUser: (username: string) => {
        set((state) => {
          if (
            state.comparisonUsers.includes(username) ||
            state.comparisonUsers.length >= 5
          ) {
            return state;
          }
          return {
            comparisonUsers: [...state.comparisonUsers, username],
          };
        });
      },
      removeComparisonUser: (username: string) => {
        set((state) => ({
          comparisonUsers: state.comparisonUsers.filter(
            (u) => u !== username
          ),
        }));
      },
      clearComparisonUsers: () => set({ comparisonUsers: [] }),
      setComparisonUsers: (users: string[]) =>
        set({ comparisonUsers: users }),

      // ---- UI ----
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
    }),
    {
      name: "leetcode-explorer-store",
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        favorites: state.favorites,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
