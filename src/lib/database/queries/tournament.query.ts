import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import { tournament } from "../db.schema";

export const getTournamentFromId = async (tournamentId: string) => {
  const res = await db.query.tournament.findFirst({
    where: eq(tournament.id, tournamentId),
  });
  return res ?? null;
};
