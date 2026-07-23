import type { SolvedStats, ContestInfo, SubmissionCalendar, Insight } from "@/types/leetcode";
import { calculateAcceptanceRate, parseSubmissionCalendar, calculateCurrentStreak, calculateLongestStreak } from "./calculations";

// ============================================================
// AI-like Insight Generation
// ============================================================

/** Generate intelligent insights from user stats */
export function generateInsights(
  solved: SolvedStats,
  contest: ContestInfo | null,
  calendar: SubmissionCalendar | null
): Insight[] {
  const insights: Insight[] = [];
  const acceptanceRate = calculateAcceptanceRate(solved);

  // Total problems insight
  if (solved.solvedProblem >= 500) {
    insights.push({
      id: "prolific-solver",
      type: "achievement",
      title: "Prolific Problem Solver",
      description: `You've solved ${solved.solvedProblem} problems! That puts you among the most dedicated LeetCoders.`,
      icon: "Trophy",
    });
  } else if (solved.solvedProblem >= 200) {
    insights.push({
      id: "solid-foundation",
      type: "strength",
      title: "Solid Foundation",
      description: `With ${solved.solvedProblem} problems solved, you have a strong foundation. Keep pushing towards 500!`,
      icon: "TrendingUp",
    });
  }

  // Difficulty distribution insights
  const total = solved.solvedProblem || 1;
  const hardPercentage = (solved.hardSolved / total) * 100;
  const mediumPercentage = (solved.mediumSolved / total) * 100;
  const easyPercentage = (solved.easySolved / total) * 100;

  if (hardPercentage > 20) {
    insights.push({
      id: "hard-solver",
      type: "strength",
      title: "Hard Problem Specialist",
      description: `${Math.round(hardPercentage)}% of your solved problems are Hard — that's impressive! Your algorithmic skills are strong.`,
      icon: "Flame",
    });
  } else if (hardPercentage < 10 && solved.solvedProblem > 50) {
    insights.push({
      id: "hard-improvement",
      type: "improvement",
      title: "Challenge Yourself with Hard Problems",
      description: `Only ${Math.round(hardPercentage)}% of your problems are Hard. Try tackling more to build advanced algorithmic skills.`,
      icon: "Target",
    });
  }

  if (mediumPercentage > 50) {
    insights.push({
      id: "medium-dominant",
      type: "strength",
      title: "Medium Difficulty Master",
      description: `Medium difficulty is your strongest category at ${Math.round(mediumPercentage)}%. This is the sweet spot for interview prep.`,
      icon: "Award",
    });
  }

  if (easyPercentage > 50 && solved.solvedProblem > 30) {
    insights.push({
      id: "easy-heavy",
      type: "improvement",
      title: "Move Beyond Easy Problems",
      description: `${Math.round(easyPercentage)}% of your problems are Easy. Consider focusing more on Medium and Hard for skill growth.`,
      icon: "ArrowUp",
    });
  }

  // Acceptance rate insight
  if (acceptanceRate > 65) {
    insights.push({
      id: "high-accuracy",
      type: "strength",
      title: "High Accuracy Coder",
      description: `Your ${acceptanceRate}% acceptance rate shows excellent problem comprehension before coding.`,
      icon: "CheckCircle",
    });
  } else if (acceptanceRate < 40 && acceptanceRate > 0) {
    insights.push({
      id: "low-accuracy",
      type: "improvement",
      title: "Improve Submission Accuracy",
      description: `At ${acceptanceRate}% acceptance rate, consider planning your approach more before submitting. Quality over quantity.`,
      icon: "AlertCircle",
    });
  }

  // Contest insights
  if (contest) {
    if (contest.contestRating > 2000) {
      insights.push({
        id: "contest-expert",
        type: "achievement",
        title: "Contest Expert",
        description: `A rating of ${Math.round(contest.contestRating)} places you among the top competitive programmers. Outstanding!`,
        icon: "Crown",
      });
    } else if (contest.contestRating > 1500) {
      insights.push({
        id: "contest-above-avg",
        type: "strength",
        title: "Above Average Contest Performance",
        description: `Your contest rating of ${Math.round(contest.contestRating)} is above average. Keep participating to improve!`,
        icon: "BarChart",
      });
    }

    if (contest.contestTopPercentage <= 10 && contest.contestTopPercentage > 0) {
      insights.push({
        id: "top-percentile",
        type: "achievement",
        title: `Top ${contest.contestTopPercentage.toFixed(1)}% Globally`,
        description: `You're in the top ${contest.contestTopPercentage.toFixed(1)}% of all LeetCode contest participants!`,
        icon: "Star",
      });
    }

    if (contest.contestAttend < 5 && contest.contestAttend > 0) {
      insights.push({
        id: "contest-newbie",
        type: "info",
        title: "Explore More Contests",
        description: `You've attended only ${contest.contestAttend} contests. Regular participation is key to improving contest skills.`,
        icon: "Calendar",
      });
    }
  }

  // Streak insights
  if (calendar) {
    const calendarDays = parseSubmissionCalendar(
      calendar.submissionCalendar
    );
    const currentStreak = calculateCurrentStreak(calendarDays);
    const longestStreak = calculateLongestStreak(calendarDays);

    if (currentStreak >= 30) {
      insights.push({
        id: "amazing-streak",
        type: "achievement",
        title: "Amazing Consistency!",
        description: `You're on a ${currentStreak}-day streak! Maintain this momentum for outstanding results.`,
        icon: "Zap",
      });
    } else if (currentStreak >= 7) {
      insights.push({
        id: "good-streak",
        type: "strength",
        title: "Great Weekly Consistency",
        description: `A ${currentStreak}-day streak shows dedication. Aim for 30+ days to build lasting habits.`,
        icon: "Activity",
      });
    } else if (currentStreak === 0 && longestStreak > 7) {
      insights.push({
        id: "restart-streak",
        type: "improvement",
        title: "Restart Your Streak",
        description: `Your best streak was ${longestStreak} days. Solve a problem today to start building consistency again!`,
        icon: "RefreshCw",
      });
    }
  }

  return insights;
}

/** Generate comparison summary for multiple users */
export function generateComparisonSummary(
  users: Array<{
    username: string;
    solved: SolvedStats | null;
    contest: ContestInfo | null;
  }>
): string[] {
  const summaries: string[] = [];
  const validUsers = users.filter((u) => u.solved);

  if (validUsers.length < 2) return summaries;

  // Most total solved
  const mostSolved = validUsers.reduce((best, u) =>
    (u.solved?.solvedProblem ?? 0) > (best.solved?.solvedProblem ?? 0)
      ? u
      : best
  );
  summaries.push(
    `🏆 ${mostSolved.username} leads with ${mostSolved.solved?.solvedProblem} total problems solved.`
  );

  // Most hard problems
  const mostHard = validUsers.reduce((best, u) =>
    (u.solved?.hardSolved ?? 0) > (best.solved?.hardSolved ?? 0) ? u : best
  );
  summaries.push(
    `🔥 ${mostHard.username} has the most Hard problems solved (${mostHard.solved?.hardSolved}).`
  );

  // Best acceptance rate
  const bestAccuracy = validUsers.reduce((best, u) => {
    const bestRate = best.solved ? calculateAcceptanceRate(best.solved) : 0;
    const uRate = u.solved ? calculateAcceptanceRate(u.solved) : 0;
    return uRate > bestRate ? u : best;
  });
  summaries.push(
    `🎯 ${bestAccuracy.username} has the highest acceptance rate (${bestAccuracy.solved ? calculateAcceptanceRate(bestAccuracy.solved) : 0}%).`
  );

  // Best contest rating
  const withContest = validUsers.filter((u) => u.contest);
  if (withContest.length > 0) {
    const bestContest = withContest.reduce((best, u) =>
      (u.contest?.contestRating ?? 0) > (best.contest?.contestRating ?? 0)
        ? u
        : best
    );
    if (bestContest.contest && bestContest.contest.contestRating > 0) {
      summaries.push(
        `⚡ ${bestContest.username} has the highest contest rating (${Math.round(bestContest.contest.contestRating)}).`
      );
    }
  }

  return summaries;
}
