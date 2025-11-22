"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { useSaveAttemptMutation } from "@/hooks/use-save-attempt";
import type { Tournament } from "@/lib/database/db.schema";
import Game from "./game";

export const TournamentPage = ({ tournament }: { tournament: Tournament }) => {
  const [attempts, setAttempts] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const {
    mutate: saveAttempt,
    isPending: isSavingAttempt,
    isSuccess: isSaveAttemptSuccess,
    error: saveAttemptError,
  } = useSaveAttemptMutation();

  // const { user, isAuthenticated } = useAuth();
  // const { isInBrowser } = useEnvironment();
  // if (isInBrowser) {
  //   return <Website page={`tournament/${tournament.id}`} />;
  // }

  // if (isAuthenticated && !user) {
  //   return <div>You are not authorized to view this page</div>;
  // }

  useEffect(() => {
    if (isGameWon) {
      saveAttempt({
        tournamentId: tournament.id,
        hasWon: isGameWon,
      });
    }
  }, [isGameWon, saveAttempt, tournament.id]);

  const handleOnAttempt = (hasWon: boolean) => {
    setAttempts(attempts + 1);
    if (hasWon) {
      setIsGameWon(true);
    }
  };

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      <Navbar link="/daily" showBackButton title="Daily Challenge" />

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
