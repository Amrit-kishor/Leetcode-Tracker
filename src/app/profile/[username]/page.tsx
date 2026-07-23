import type { Metadata } from "next";
import { ProfileDashboard } from "@/components/profile/profile-dashboard";

type Params = Promise<{ username: string }>;

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | LeetCode Progress Explorer`,
    description: `View LeetCode coding statistics and progress for ${username}`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Params;
}) {
  const { username } = await params;
  return <ProfileDashboard username={username} />;
}
