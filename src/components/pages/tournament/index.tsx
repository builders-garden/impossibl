/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
"use client";

import { MiniKit, Permission } from "@worldcoin/minikit-js";
import { ArrowLeftIcon, BellIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import Game from "@/components/shared/game";
import { Navbar } from "@/components/shared/navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [gameInstanceId, setGameInstanceId] = useState(0);
  const {
    mutate: saveAttempt,
    isPending: isSavingAttempt,
    isSuccess: isSaveAttemptSuccess,
    error: saveAttemptError,
  } = useSaveAttemptMutation();

  const handleOnAttempt = (hasWon: boolean) => {
    setAttempts((prev) => prev + 1);
    setIsGameWon(hasWon);
    saveAttempt({
      tournamentId: tournament.id,
      hasWon,
    });
  };

  const handleGameStateChange = (
    state: "playing" | "won" | "paused" | "lost"
  ) => {
    if (state === "won") {
      setIsGameWon(true);
      setShowVictoryDialog(true);
    } else if (state === "lost") {
      setIsGameWon(false);
      setShowVictoryDialog(true);
    }
  };

  const handlePlayAgain = () => {
    setShowVictoryDialog(false);
    setAttempts(0);
    setIsGameWon(false);
    setGameInstanceId((prev) => prev + 1);
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
        prizePool={
          tournamentOnchainData
            ? Number.parseFloat(
                formatUnits(BigInt(tournamentOnchainData.prizePool), 18)
              )
            : tournament.prizePool
        }
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
            key={gameInstanceId}
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
        <DialogTitle className="sr-only">Game</DialogTitle>
        <DialogDescription className="sr-only">
          {isGameWon ? "Level Complete" : "Level Failed"}
        </DialogDescription>
        <DialogContent
          className="mx-4 max-w-md border bg-background p-6 shadow-lg sm:max-w-2xl sm:p-8"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center gap-8">
            {/* Title */}
            <div className="flex animate-bounce-slow flex-col items-center gap-2 text-center">
              <h1 className="font-black font-orbitron text-3xl text-foreground uppercase tracking-wider sm:text-4xl">
                {isGameWon ? (
                  <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]">
                    Victory!
                  </span>
                ) : (
                  <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                    Game Over
                  </span>
                )}
              </h1>
              <p className="mt-2 font-bold text-lg text-muted-foreground sm:text-xl">
                {isGameWon ? (
                  <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                    Level Complete
                  </span>
                ) : (
                  <span className="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.6)]">
                    Level Failed
                  </span>
                )}
              </p>
              <p className="wrap-break-word max-w-xs text-center font-bold font-oxanium text-muted-foreground/80 text-sm">
                {isGameWon
                  ? "Come back tomorrow to claim your prize"
                  : "Tap AGAIN to try the level again"}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="flex flex-col justify-center rounded-lg border bg-muted/20 p-4 backdrop-blur-sm">
                <p className="font-oxanium text-muted-foreground text-sm uppercase tracking-wide">
                  Attempts
                </p>
                <p className="mt-1 font-bold font-orbitron text-4xl text-foreground">
                  {attempts}
                </p>
              </div>
              <button
                className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border bg-muted/20 p-4 backdrop-blur-sm transition-all hover:scale-105 hover:bg-muted/40"
                onClick={handleNotifyMe}
                type="button"
              >
                <BellIcon className="size-8 text-foreground" />
                <span className="font-bold font-oxanium text-muted-foreground text-sm uppercase tracking-wide">
                  Notify me!
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-4">
              {isGameWon ? (
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-4 font-bold text-background text-lg uppercase tracking-wide shadow-md transition-all hover:scale-105 hover:bg-foreground/90"
                  onClick={handleBackToLobby}
                  type="button"
                >
                  <ArrowLeftIcon className="size-6" />
                  <span className="font-bold font-oxanium text-lg uppercase tracking-wide">
                    Lobby
                  </span>
                </button>
              ) : (
                <>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-4 font-bold text-background text-lg uppercase tracking-wide shadow-md transition-all hover:scale-105 hover:bg-foreground/90"
                    onClick={handlePlayAgain}
                    type="button"
                  >
                    <RotateCcwIcon className="size-6" />
                    <span className="font-bold font-oxanium text-lg uppercase tracking-wide">
                      Again
                    </span>
                  </button>
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border bg-muted/20 px-6 py-4 font-bold text-lg text-muted-foreground uppercase tracking-wide transition-all hover:scale-105 hover:bg-muted/40"
                    onClick={handleBackToLobby}
                    type="button"
                  >
                    <ArrowLeftIcon className="size-6" />
                    <span className="font-bold font-oxanium text-lg uppercase tracking-wide">
                      Lobby
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
