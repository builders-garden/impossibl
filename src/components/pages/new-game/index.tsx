"use client";

import { useState } from "react";
import { Website } from "@/components/pages/website";
import { Navbar } from "@/components/shared/navbar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { env } from "@/lib/env";
import { SetupGameCard } from "./setup-game-card";
import { SuccessGameCard } from "./success-game-card";

export function NewGamePage() {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();
  const [buyInAmount, setBuyInAmount] = useState("1.00");
  const [timeLimitValue, setTimeLimitValue] = useState("1");
  const [timeLimitUnit, setTimeLimitUnit] = useState("WEEK");
  const [isGameCreated, setIsGameCreated] = useState(false);
  const [gameLink, setGameLink] = useState("");

  if (isInBrowser) {
    return <Website page="new" />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  const handleCreateGame = () => {
    // Simulate game creation
    const mockGameId = Math.random().toString(36).substring(2, 8);
    const link = `${env.NEXT_PUBLIC_URL}/g/${mockGameId}`;
    setGameLink(link);
    setIsGameCreated(true);
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
