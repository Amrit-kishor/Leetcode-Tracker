"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface SearchBarProps {
  size?: "default" | "large";
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  size = "default",
  className,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchHistory, removeSearch } = useAppStore();

  const showDropdown = isFocused && searchHistory.length > 0 && !query;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/profile/${trimmed}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isLarge = size === "large";

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-2xl border bg-card shadow-lg transition-all duration-300",
          isFocused
            ? "border-primary/50 shadow-primary/10 ring-2 ring-primary/20"
            : "border-border/50 shadow-black/5",
          isLarge ? "px-5 py-3" : "px-3 py-1.5"
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-muted-foreground",
            isLarge ? "h-5 w-5" : "h-4 w-4"
          )}
        />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search LeetCode username..."
          className={cn(
            "border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:outline-none",
            isLarge ? "text-lg placeholder:text-base" : "text-sm"
          )}
          aria-label="Search LeetCode username"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={() => setQuery("")}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          onClick={handleSearch}
          disabled={!query.trim()}
          className={cn(
            "shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700",
            isLarge ? "px-6 py-2.5" : "px-4 py-2"
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Search history dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full z-50 mt-2 w-full rounded-xl border border-border/50 bg-card p-2 shadow-xl"
          >
            <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
              Recent Searches
            </p>
            {searchHistory.slice(0, 5).map((entry) => (
              <div
                key={entry.username}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-accent cursor-pointer"
                onMouseDown={() =>
                  router.push(`/profile/${entry.username}`)
                }
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{entry.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    removeSearch(entry.username);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
