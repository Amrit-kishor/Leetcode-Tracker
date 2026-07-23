"use client";

import { motion } from "motion/react";
import {
  Globe,
  MapPin,
  Building2,
  GraduationCap,
  Award,
  Heart,
  HeartOff,
  Download,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/stores/app-store";
import type { UserProfile, SolvedStats, UserBadges } from "@/types/leetcode";
import { formatNumber } from "@/utils/calculations";
import { exportToCSV, exportToJSON } from "@/utils/export";
import { toast } from "sonner";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

interface UserHeaderProps {
  profile: UserProfile;
  solved: SolvedStats;
  badges: UserBadges | undefined;
  username: string;
}

export function UserHeader({ profile, solved, badges, username }: UserHeaderProps) {
  const { isFavorite, addFavorite, removeFavorite } = useAppStore();
  const isFav = isFavorite(username);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(username);
      toast.success(`Removed ${username} from favorites`);
    } else {
      addFavorite({
        username,
        avatar: profile.avatar,
        name: profile.name,
        totalSolved: solved.solvedProblem,
        addedAt: Date.now(),
      });
      toast.success(`Added ${username} to favorites`);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Username", username],
      ["Name", profile.name || ""],
      ["Ranking", profile.ranking],
      ["Reputation", profile.reputation],
      ["Total Solved", solved.solvedProblem],
      ["Easy Solved", solved.easySolved],
      ["Medium Solved", solved.mediumSolved],
      ["Hard Solved", solved.hardSolved],
    ];
    exportToCSV(headers, rows, `${username}_leetcode_stats`);
    toast.success("Exported statistics to CSV");
  };

  const handleExportJSON = () => {
    exportToJSON({ profile, solved, badges }, `${username}_leetcode_data`);
    toast.success("Exported statistics to JSON");
  };

  const socials = [
    { icon: Github, url: profile.gitHub, label: "GitHub" },
    { icon: Linkedin, url: profile.linkedIN, label: "LinkedIn" },
    { icon: Twitter, url: profile.twitter, label: "Twitter" },
    ...(profile.website?.length
      ? [{ icon: Globe, url: profile.website[0], label: "Website" }]
      : []),
  ].filter((s) => s.url);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-lg sm:h-24 sm:w-24">
          <AvatarImage src={profile.avatar} alt={profile.name || username} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white">
            {(profile.name || username)[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {profile.name || username}
              </h1>
              <p className="text-muted-foreground">@{username}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={isFav ? "default" : "outline"}
                size="sm"
                onClick={toggleFavorite}
              >
                {isFav ? (
                  <>
                    <HeartOff className="mr-1.5 h-4 w-4" /> Unfavorite
                  </>
                ) : (
                  <>
                    <Heart className="mr-1.5 h-4 w-4" /> Favorite
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1.5 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={handleExportCSV}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleExportJSON}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Meta info */}
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {profile.country && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {profile.country}
              </span>
            )}
            {profile.company && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {profile.company}
              </span>
            )}
            {profile.school && (
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" /> {profile.school}
              </span>
            )}
          </div>

          {/* Ranking & Reputation */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              <Award className="mr-1 h-3 w-3" /> Rank #{formatNumber(profile.ranking)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ⭐ {profile.reputation} reputation
            </Badge>
            {badges?.badges && badges.badges.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                🏅 {badges.badges.length} badges
              </Badge>
            )}
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <a
                        href={
                          social.url!.startsWith("http")
                            ? social.url!
                            : `https://${social.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{social.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
