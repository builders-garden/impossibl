"use client";

import { useEffect, useState } from "react";
import { Website } from "@/components/pages/website";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useCreateGroupTournamentMutation } from "@/hooks/use-create-group-tournament";
import { env } from "@/lib/env";
import { SetupGameCard } from "./setup-game-card";
import { SuccessGameCard } from "./success-game-card";

export function NewGamePage() {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser, isInWorldcoinMiniApp } = useEnvironment();
  const [buyInAmount, setBuyInAmount] = useState("1.00");
  const [timeLimitValue, setTimeLimitValue] = useState("1");
  const [timeLimitUnit, setTimeLimitUnit] = useState("DAY");
  const [isGameCreated, setIsGameCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameLink, setGameLink] = useState("");
  const { mutate: createGroupTournament, data: createGroupData } =
    useCreateGroupTournamentMutation({ isInWorldcoin: isInWorldcoinMiniApp });

  useEffect(() => {
    if (createGroupData) {
      console.log("createGroupTournamentData", createGroupData);
      if (createGroupData.status === "ok") {
        setIsGameCreated(true);
        setGameLink(
          `${env.NEXT_PUBLIC_URL}/play/${createGroupData.data.tournamentId}`
        );
        setIsLoading(false);
        setIsGameCreated(true);
      }
    }
  }, [createGroupData]);

  if (isInBrowser) {
    return <Website page="new" />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  const handleCreateGame = () => {
    setIsLoading(true);
    console.log("createGroupTournament");
    createGroupTournament();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join my game on Impossibl",
        text: "Can you beat the impossible game?",
        url: gameLink,
      });
    } else {
      navigator.clipboard.writeText(gameLink);
    }
  };

  const isValid =
    Number.parseFloat(buyInAmount) >= 1 &&
    Number.parseInt(timeLimitValue, 10) > 0;

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto bg-black font-orbitron text-white">
      <Navbar link="/" showBackButton title="Play w/ Friends" />

      <div className="flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        {isGameCreated ? (
          <SuccessGameCard
            buyInAmount={buyInAmount}
            gameLink={gameLink}
            isLoading={isLoading}
            onShare={handleShare}
            timeLimit={`${timeLimitValue} ${timeLimitUnit}`}
          />
        ) : (
          <>
            <SetupGameCard
              buyInAmount={buyInAmount}
              isValid={isValid}
              onBuyInAmountChange={setBuyInAmount}
              onSubmit={handleCreateGame}
              onTimeLimitUnitChange={setTimeLimitUnit}
              onTimeLimitValueChange={setTimeLimitValue}
              timeLimitUnit={timeLimitUnit}
              timeLimitValue={timeLimitValue}
            />
            <p className="text-center font-medium font-orbitron text-white text-xl">
              After creating, you&apos;ll get a link to share with friends
            </p>
          </>
        )}
      </div>
    </div>
  );
}
