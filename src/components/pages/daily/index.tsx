"use client";

import { Website } from "@/components/pages/website";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import type { Tournament } from "@/lib/database/db.schema";
import { Leaderboard } from "../../shared/leaderboard";
import { StatsCard } from "./stats-card";

export function DailyPage({ tournament }: { tournament: Tournament }) {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();

  if (isInBrowser) {
    return <Website page="daily" />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      <Navbar link="/" showBackButton title="Daily Challenge" />

      <div className="flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        {/* Main Content */}
        <div className="flex flex-col gap-4">
          <StatsCard
            endAt={new Date(tournament.endDate)}
            prizePool={tournament.prizePool}
          />
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
    </div>
  );
}
