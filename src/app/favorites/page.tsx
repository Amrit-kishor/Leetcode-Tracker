import type { Metadata } from "next";
import { FavoritesDashboard } from "@/components/favorites/favorites-dashboard";

export const metadata: Metadata = {
  title: "Favorites | LeetCode Progress Explorer",
  description:
    "Manage your favorite LeetCode users for quick access.",
};

export default function FavoritesPage() {
  return <FavoritesDashboard />;
}
