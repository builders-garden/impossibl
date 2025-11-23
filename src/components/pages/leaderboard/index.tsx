"use client";

import { Website } from "@/components/pages/website";
import { Leaderboard } from "@/components/shared/leaderboard";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useGetMyPrize } from "@/hooks/use-get-my-prize";
import { useGetUserPrizesByTournament } from "@/hooks/use-get-tournament";
import type { Tournament } from "@/lib/database/db.schema";

export function LeaderboardPage({ tournament }: { tournament: Tournament }) {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();
  const { data: myPrize } = useGetMyPrize({
    tournamentId: tournament.id,
  });
  const { data: userPrizes } = useGetUserPrizesByTournament({
    tournamentId: tournament.id,
  });
  const myRank =
    userPrizes?.status === "ok"
      ? userPrizes.data.findIndex((prize) => prize.userId === user?.id)
      : -1;

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
            items={
              userPrizes?.status === "ok"
                ? userPrizes.data.map((prize, index) => ({
                    rank: index + 1,
                    userId: prize.userId,
                    pfpUrl: undefined,
                    name: prize.user.name,
                    attempts: prize.attempts,
                  }))
                : []
            }
            you={{
              rank: (myRank ?? 0) + 1,
              userId: user.id,
              pfpUrl: user.image ?? undefined,
              name: user.name,
              attempts: myPrize?.status === "ok" ? myPrize.data.attempts : 0,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
