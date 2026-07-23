"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Trash2, ExternalLink, UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";

// ============================================================
// Helpers
// ============================================================

/** Deterministic hue from a string */
function hueFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

// ============================================================
// Main Component
// ============================================================

export function FavoritesDashboard() {
  const favorites = useAppStore((s) => s.favorites);
  const removeFavorite = useAppStore((s) => s.removeFavorite);

  const isEmpty = favorites.length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
            Favorites
          </span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Quick access to the LeetCode profiles you care about.
        </p>
      </motion.div>

      {/* Empty state */}
      <AnimatePresence>
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center gap-4 py-20"
          >
            <div className="rounded-full bg-muted p-5">
              <Heart className="size-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">No favorites yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Search for users and add them to your favorites for quick
                access.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites grid */}
      {!isEmpty && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {favorites.map((fav, i) => {
              const hue = hueFromString(fav.username);
              const initials = fav.username.slice(0, 2).toUpperCase();

              return (
                <motion.div
                  key={fav.username}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 backdrop-blur-sm ring-1 ring-white/10 transition-shadow hover:shadow-lg hover:shadow-pink-500/5">
                    <CardContent className="flex flex-col items-center gap-4 pt-6 pb-5">
                      {/* Avatar circle */}
                      <div
                        className="flex size-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 40) % 360}, 65%, 45%))`,
                        }}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>

                      {/* Username */}
                      <div className="text-center">
                        <p className="font-semibold">{fav.username}</p>
                        {fav.name && (
                          <p className="text-xs text-muted-foreground">
                            {fav.name}
                          </p>
                        )}
                        {fav.totalSolved !== undefined && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {fav.totalSolved} solved
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          render={
                            <Link href={`/profile/${fav.username}`} />
                          }
                        >
                          <UserCircle className="size-3.5" />
                          View Profile
                          <ExternalLink className="size-3 opacity-50" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeFavorite(fav.username)}
                          aria-label={`Remove ${fav.username} from favorites`}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
