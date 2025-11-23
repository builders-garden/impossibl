import { notFound } from "next/navigation";
import { HomePage } from "@/components/pages/home";
import { getActiveDailyTournament } from "@/lib/database/queries/tournament.query";

export default async function Home() {
  const tournament = await getActiveDailyTournament();
  if (!tournament) {
    console.log("No tournament found");
    notFound();
  }

  return <HomePage tournament={tournament} />;
}
