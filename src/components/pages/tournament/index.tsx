"use client";

import { Navbar } from "@/components/shared/navbar";
import type { Tournament } from "@/lib/database/db.schema";
import Game from "./game";

export const TournamentPage = ({ tournament }: { tournament: Tournament }) => {
  console.log("tournament", tournament);
  // const { user, isAuthenticated } = useAuth();
  // const { isInBrowser } = useEnvironment();
  // if (isInBrowser) {
  //   return <Website page={`tournament/${tournament.id}`} />;
  // }

  // if (isAuthenticated && !user) {
  //   return <div>You are not authorized to view this page</div>;
  // }

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      <Navbar link="/daily" showBackButton title="Daily Challenge" />

      <div className="flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        <Game />
      </div>
    </div>
  );
};
