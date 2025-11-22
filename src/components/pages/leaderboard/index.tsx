"use client";

import { Website } from "@/components/pages/website";
import { Leaderboard } from "@/components/shared/leaderboard";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";

export function LeaderboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();

  if (isInBrowser) {
    return <Website page="new" />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      <Navbar link="/" showBackButton title="Leaderboard" />

      <div className="flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        {user ? (
          <Leaderboard
            items={[]}
            you={{
              rank: 0,
              userId: user.id,
              pfpUrl: user.image ?? undefined,
              name: user.name,
              attempts: 0,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
