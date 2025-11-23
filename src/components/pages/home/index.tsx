"use client";

import { Website } from "@/components/pages/website";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import type { Tournament } from "@/lib/database/db.schema";
import { DailyChallengeCard } from "../../shared/daily-challenge-card";
import { GameOptions } from "./game-options";
import { PlayWithFriendsCard } from "./play-with-friends-card";

export function HomePage({ tournament }: { tournament: Tournament }) {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();

  if (isInBrowser) {
    return <Website />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        <DailyChallengeCard
          endAt={new Date(tournament.endDate)}
          prizePool={tournament.prizePool}
        />
        <PlayWithFriendsCard />
        <GameOptions />
      </div>
    </div>
  );
}
