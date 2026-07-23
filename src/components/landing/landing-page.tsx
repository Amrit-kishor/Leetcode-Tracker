"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BarChart3,
  GitCompareArrows,
  TrendingUp,
  Sparkles,
  Heart,
  Clock,
  X,
  ArrowRight,
} from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/app-store";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Explore detailed problem-solving stats, acceptance rates, and skill breakdowns.",
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: GitCompareArrows,
    title: "User Comparison",
    description:
      "Compare 2–5 LeetCode users side by side with interactive visualizations.",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Contest Tracking",
    description:
      "Track contest ratings, rankings, and performance trends over time.",
    gradient: "from-cyan-500/20 to-teal-500/20",
    iconColor: "text-cyan-500",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description:
      "Get intelligent recommendations to improve your coding skills and consistency.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingPage() {
  const { searchHistory, removeSearch, clearSearchHistory, favorites } =
    useAppStore();

  return (
    <div className="relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center pt-16 pb-12 text-center sm:pt-24 sm:pb-16"
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-xs font-medium"
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              Powered by Real-Time LeetCode Data
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="gradient-text">LeetCode</span>
            <br />
            <span className="text-foreground">Progress Explorer</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            <span className="font-semibold text-indigo-500">Analyze</span>
            {" • "}
            <span className="font-semibold text-purple-500">Compare</span>
            {" • "}
            <span className="font-semibold text-cyan-500">Improve</span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="w-full max-w-xl"
          >
            <SearchBar size="large" autoFocus />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-4 text-sm text-muted-foreground"
          >
            Try searching:{" "}
            {["neal_wu", "tourist", "lee215"].map((name, i) => (
              <span key={name}>
                {i > 0 && ", "}
                <Link
                  href={`/profile/${name}`}
                  className="text-primary hover:underline underline-offset-4"
                >
                  {name}
                </Link>
              </span>
            ))}
          </motion.p>
        </motion.section>

        {/* Feature Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient}`}
                    >
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Recent Searches */}
        {searchHistory.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pb-12"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Recent Searches</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={clearSearchHistory}
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((entry) => (
                <div
                  key={entry.username}
                  className="group flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-sm transition-all hover:border-primary/30"
                >
                  <Link
                    href={`/profile/${entry.username}`}
                    className="hover:text-primary"
                  >
                    {entry.username}
                  </Link>
                  <button
                    onClick={() => removeSearch(entry.username)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label={`Remove ${entry.username} from history`}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pb-16"
          >
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <h2 className="text-sm font-semibold">Favorites</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.slice(0, 6).map((fav) => (
                <Link
                  key={fav.username}
                  href={`/profile/${fav.username}`}
                >
                  <Card className="group border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
                        {fav.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium group-hover:text-primary transition-colors">
                          {fav.username}
                        </p>
                        {fav.totalSolved !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {fav.totalSolved} problems solved
                          </p>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
