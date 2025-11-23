"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import Game from "@/components/shared/game";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useCheckDeposit } from "@/hooks/use-check-deposit";
import { useGetMyPrize } from "@/hooks/use-get-my-prize";
import { useGetUserPrizesByTournament } from "@/hooks/use-get-tournament";
import { useGetTournamentOnchain } from "@/hooks/use-get-tournament-onchain";
import { useSaveAttemptMutation } from "@/hooks/use-save-attempt";
import type { Tournament } from "@/lib/database/db.schema";
import { Website } from "../website";
import { TournamentLobby } from "./lobby";

export const TournamentPage = ({ tournament }: { tournament: Tournament }) => {
  const { address } = useAccount();
  const worldWalletAddress = MiniKit.user.walletAddress;
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();
  const { data: userPrize, isLoading: isLoadingUserPrize } = useGetMyPrize({
    tournamentId: tournament.id,
  });
  const { data: userPrizes, isLoading: isLoadingUserPrizes } =
    useGetUserPrizesByTournament({
      tournamentId: tournament.id,
    });
  const { hasJoined, isLoading: isLoadingHasJoined } = useCheckDeposit({
    tournamentId: tournament.id,
    address: (worldWalletAddress as `0x${string}`) || address || zeroAddress,
  });
  const { data: tournamentOnchainData, isLoading: isLoadingTournamentOnchain } =
    useGetTournamentOnchain({
      tournamentId: tournament.id,
    });

  const [isPlaying, setIsPlaying] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const {
    mutate: saveAttempt,
    isPending: isSavingAttempt,
    isSuccess: isSaveAttemptSuccess,
    error: saveAttemptError,
  } = useSaveAttemptMutation();

  useEffect(() => {
    saveAttempt({
      tournamentId: tournament.id,
      hasWon: isGameWon,
    });
  }, [isGameWon, saveAttempt, tournament.id]);

  const handleOnAttempt = (hasWon: boolean) => {
    setAttempts(attempts + 1);
    if (hasWon) {
      setIsGameWon(true);
    }
  };

  if (isInBrowser) {
    return <Website page={`play/${tournament.id}`} />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  if (!isPlaying) {
    return (
      <TournamentLobby
        hasDeposited={hasJoined ?? false}
        hasWinner={
          tournamentOnchainData
            ? tournamentOnchainData?.winner !== zeroAddress
            : false
        }
        isLoading={
          isLoadingUserPrize ||
          isLoadingUserPrizes ||
          isLoadingHasJoined ||
          isLoadingTournamentOnchain
        }
        myPrize={userPrize?.status === "ok" ? userPrize.data : null}
        onPlay={() => setIsPlaying(true)}
        tournament={tournament}
        user={user}
        userPrizes={userPrizes?.status === "ok" ? userPrizes.data : []}
      />
    );
  }

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      <Navbar link="/" showBackButton title={tournament.name} />

      <div className="flex w-full flex-col gap-4 px-4 pb-12">
        <Game
          attempts={attempts}
          error={saveAttemptError ? saveAttemptError.message : null}
          loading={isSavingAttempt}
          onAttempt={handleOnAttempt}
          ready={(isSavingAttempt && isSaveAttemptSuccess) || !isSavingAttempt}
        />
      </div>
    </div>
  );
};
