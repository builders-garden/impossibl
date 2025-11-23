"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Tournament } from "@/lib/database/db.schema";
import { cn } from "@/utils";
import { StatsCard } from "../daily/stats-card";

type TournamentLobbyProps = {
  tournament: Tournament;
  onPlay: () => void;
};

export const TournamentLobby = ({
  tournament,
  onPlay,
}: TournamentLobbyProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8 bg-black px-6 py-12 font-orbitron text-white">
      {/* Header */}
      <div className="flex w-full items-start justify-between">
        <Link className="relative size-6 shrink-0" href="/">
          <ArrowLeftIcon className="size-full" />
        </Link>
        <h1 className="font-extrabold text-4xl text-white leading-7 tracking-[-0.5px]">
          {tournament.name}
        </h1>
      </div>

      {/* Content */}
      <div className="flex w-full flex-col gap-4">
        {/* Stats Card */}
        <LobbyStatsCard
          endAt={new Date(tournament.endDate)}
          onPlay={onPlay}
          prizePool={tournament.prizePool}
        />

        {/* Leaderboard Card */}
        <LobbyLeaderboard />
      </div>
    </div>
  );
};

const LobbyStatsCard = ({
  endAt,
  prizePool,
  onPlay,
}: {
  endAt: Date;
  prizePool: number;
  onPlay: () => void;
}) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border-4 border-blue-500/40 bg-blue-500/10 p-6">
      <StatsCard endAt={endAt} prizePool={prizePool} />

      {/* Play Button */}
      <Button
        className="h-auto w-full rounded-lg bg-blue-500 px-2 py-4 hover:bg-blue-600"
        onClick={onPlay}
      >
        <span className="font-extrabold font-oxanium text-4xl text-black leading-[28px] tracking-[-0.5px]">
          PLAY
        </span>
      </Button>
    </div>
  );
};

const LobbyLeaderboard = () => {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border-4 border-white/40 p-6">
      <h2 className="font-bold text-4xl text-white leading-[28px] tracking-[-0.5px]">
        Leaderboard
      </h2>

      <div className="flex w-full flex-col gap-4">
        <LeaderboardRow
          attempts={1}
          color="bg-[#d9b608]"
          name="limone.eth"
          rank={1}
        />
        <LeaderboardRow
          attempts={4}
          color="bg-gray-600"
          name="bianc8.eth"
          rank={2}
        />
        <LeaderboardRow
          attempts={5}
          color="bg-[#725f00]"
          name="frank.eth"
          rank={3}
        />
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-white/25" />

      {/* User Rank */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-blue-500 px-2 py-1">
            <span className="font-black text-base text-black leading-[28px] tracking-[-0.5px]">
              #47
            </span>
          </div>
          <div className="flex flex-col justify-center font-medium leading-[28px] tracking-[-0.5px]">
            <span className="text-base text-white">You</span>
            <span className="text-white/25 text-xs">In Progress</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-center font-medium leading-[28px] tracking-[-0.5px]">
          <span className="text-base text-white">23 attempts</span>
          <span className="text-white/25 text-xs">Current</span>
        </div>
      </div>

      {/* View All Button */}
      <div className="flex w-full gap-4">
        <div className="flex grow items-center justify-center rounded-lg border-4 border-white/25 px-2 py-4">
          <span className="text-center font-extrabold font-oxanium text-4xl text-white leading-[28px] tracking-[-0.5px]">
            VIEW ALL
          </span>
        </div>
      </div>
    </div>
  );
};

const LeaderboardRow = ({
  rank,
  name,
  attempts,
  color,
}: {
  rank: number;
  name: string;
  attempts: number;
  color: string;
}) => (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg px-2 py-1",
          color
        )}
      >
        <span className="font-black text-base text-black leading-[28px] tracking-[-0.5px]">
          #{rank}
        </span>
      </div>
      <span className="font-medium text-base text-white leading-[28px] tracking-[-0.5px]">
        {name}
      </span>
    </div>
    <span className="font-medium text-base text-white leading-[28px] tracking-[-0.5px]">
      {attempts} {attempts === 1 ? "attempt" : "attempts"}
    </span>
  </div>
);
