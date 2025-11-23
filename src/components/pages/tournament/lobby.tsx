"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Leaderboard } from "@/components/shared/leaderboard";
import type { User } from "@/lib/auth";
import type { Tournament, UserPrize } from "@/lib/database/db.schema";
import { StatsCard } from "./stats-card";

type TournamentLobbyProps = {
  tournament: Tournament;
  hasDeposited: boolean;
  hasWinner: boolean;
  isLoading: boolean;
  user?: User;
  isInWorld: boolean;
  myPrize: UserPrize | null;
  userPrizes: (UserPrize & { user: User })[];
  prizePool: number;
  onPlay: () => void;
};

export const TournamentLobby = ({
  prizePool,
  tournament,
  hasDeposited,
  hasWinner,
  isLoading,
  isInWorld,
  onPlay,
  user,
  myPrize,
  userPrizes,
}: TournamentLobbyProps) => {
  const myRank = userPrizes.findIndex((prize) => prize.userId === user?.id);
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 bg-black px-4 py-6 font-orbitron text-white">
      {/* Header */}
      <div className="flex w-full items-center justify-start gap-2">
        <Link className="relative size-6 shrink-0" href="/">
          <ArrowLeftIcon className="size-full" />
        </Link>
        <h1 className="font-extrabold text-4xl text-white leading-7 tracking-[-0.5px]">
          {tournament.name}
        </h1>
        {hasWinner ? (
          <span className="font-extrabold text-blue-500 text-xl leading-7 tracking-[-0.5px]">
            Ended
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex w-full flex-col gap-4">
        {/* Stats Card */}
        <StatsCard
          className="border-blue-500/40 bg-blue-500/10"
          endAt={new Date(tournament.endDate)}
          hasDeposited={hasDeposited}
          hasWinner={hasWinner}
          isInWorld={isInWorld}
          isLoading={isLoading}
          onPlay={onPlay}
          prizePool={prizePool}
          tournamentId={tournament.id}
          userPrizesLength={userPrizes.length}
        />

        {/* Leaderboard Card */}
        {user ? (
          <Leaderboard
            items={userPrizes.map((prize, index) => ({
              rank: index + 1,
              userId: prize.userId,
              pfpUrl: undefined,
              name: prize.user.name,
              attempts: prize.attempts,
            }))}
            you={{
              rank: (myRank ?? 0) + 1,
              userId: user.id,
              pfpUrl: user.image ?? undefined,
              name: user.name,
              attempts: myPrize?.attempts ?? 0,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
