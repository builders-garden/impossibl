import { and, eq, gte } from "drizzle-orm";
import { db } from "@/lib/database";
import {
  type CreateTournament,
  tournament,
  type UpdateTournament,
} from "../db.schema";

/**
 * Get active daily tournament (type 0)
 */
export const getActiveDailyTournament = async () => {
  const res = await db.query.tournament.findFirst({
    where: and(eq(tournament.type, 0), gte(tournament.endDate, new Date())),
  });
  return res ?? null;
};

/**
 * Get a tournament by id
 * @param tournamentId - The id of the tournament to get
 * @returns The tournament
 */
export const getTournamentById = async (tournamentId: string) => {
  const res = await db.query.tournament.findFirst({
    where: eq(tournament.id, tournamentId),
  });
  return res ?? null;
};

/**
 * Create a new tournament in the database
 * @param tournamentData - The data for the new tournament
 * @returns The new tournament
 */
export const createTournament = async (tournamentData: CreateTournament) => {
  const [res] = await db.insert(tournament).values(tournamentData).returning();
  return res ?? null;
};

/**
 * Update a tournament in the database
 * @param tournamentId - The id of the tournament to update
 * @param tournamentData - The data to update the tournament with
 * @returns The updated tournament
 */
export const updateTournament = async (
  tournamentId: string,
  tournamentData: UpdateTournament
) => {
  const [res] = await db
    .update(tournament)
    .set(tournamentData)
    .where(eq(tournament.id, tournamentId))
    .returning();
  return res ?? null;
};
