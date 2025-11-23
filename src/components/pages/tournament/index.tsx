/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
"use client";

import { MiniKit, Permission } from "@worldcoin/minikit-js";
import { ArrowLeftIcon, BellIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import Game from "@/components/shared/game";
import { Navbar } from "@/components/shared/navbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);
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

  const handleGameStateChange = (state: "playing" | "won" | "paused") => {
    if (state === "won") {
      setShowVictoryDialog(true);
    }
  };

  const handlePlayAgain = () => {
    setShowVictoryDialog(false);
    setAttempts(0);
    setIsGameWon(false);
    window.location.reload(); // Reload to restart the game
  };

  const handleBackToLobby = () => {
    setShowVictoryDialog(false);
    setIsPlaying(false);
  };

  const handleNotifyMe = async () => {
    console.log("notify me");
    const payload = await MiniKit.commandsAsync.requestPermission({
      permission: Permission.Notifications,
    });
    console.log("notify me payload", payload);
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
        prizePool={tournament.prizePool}
        tournament={tournament}
        user={user}
        userPrizes={userPrizes?.status === "ok" ? userPrizes.data : []}
      />
    );
  }

  return (
    <>
      <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
        <Navbar link="/" showBackButton title={tournament.name} />

        <div className="flex w-full flex-col gap-4 px-4 pb-12">
          <Game
            attempts={attempts}
            error={saveAttemptError ? saveAttemptError.message : null}
            loading={isSavingAttempt}
            onAttempt={handleOnAttempt}
            onGameStateChange={handleGameStateChange}
            ready={
              (isSavingAttempt && isSaveAttemptSuccess) || !isSavingAttempt
            }
          />
        </div>
      </div>

      <Dialog onOpenChange={setShowVictoryDialog} open={showVictoryDialog}>
        <DialogContent
          className="mx-4 max-w-md border-4 border-cyan-400 bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl shadow-cyan-500/50 sm:max-w-2xl sm:p-8"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Title */}
            <div className="flex animate-bounce-slow flex-col items-center gap-2 text-center">
              <h1
                className="font-black font-orbitron text-3xl text-transparent uppercase tracking-wider sm:text-4xl"
                style={{
                  background:
                    "linear-gradient(180deg, #FFF 0%, #FFD700 50%, #FF8C00 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
                }}
              >
                Victory!
              </h1>
              <p className="mt-2 font-bold text-cyan-300 text-lg sm:text-xl">
                Level Complete
              </p>
              <p className="wrap-break-word max-w-xs text-center font-bold font-chakra-petch text-gray-300 text-sm">
                Comeback tomorrow to claim your prize
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="rounded-lg border-2 border-cyan-600 bg-slate-950/50 p-4 backdrop-blur-sm">
                <p className="font-['Chakra_Petch'] text-cyan-400 text-sm uppercase tracking-wide">
                  Attempts
                </p>
                <p className="mt-1 font-['Orbitron'] font-bold text-4xl text-white">
                  {attempts}
                </p>
              </div>
              <button
                className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-emerald-600 bg-slate-950/50 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:border-emerald-400"
                onClick={handleNotifyMe}
                type="button"
              >
                <BellIcon className="size-8" />
                <span className="font-bold font-chakra-petch text-sm text-white uppercase tracking-wide">
                  Notify me!
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-4">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-4 border-blue-500 bg-linear-to-br from-cyan-600 to-cyan-800 px-6 py-4 font-bold text-lg text-white uppercase tracking-wide shadow-cyan-500/50 shadow-lg transition-all hover:scale-105 hover:shadow-cyan-500/70"
                onClick={handlePlayAgain}
                type="button"
              >
                <RotateCcwIcon className="size-6" />
                <span className="font-bold font-chakra-petch text-lg text-white uppercase tracking-wide">
                  Again
                </span>
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-4 border-orange-500 bg-linear-to-br from-orange-600 to-orange-800 px-6 py-4 font-bold text-lg text-white uppercase tracking-wide shadow-lg shadow-orange-500/50 transition-all hover:scale-105 hover:shadow-orange-500/70"
                onClick={handleBackToLobby}
                type="button"
              >
                <ArrowLeftIcon className="size-6" />
                <span className="font-bold font-chakra-petch text-lg text-white uppercase tracking-wide">
                  Lobby
                </span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
