import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/database";
import { userPrize } from "@/lib/database/db.schema";

/**
 * Save a user's attempt for a tournament
 * @param userId - The id of the user to save the attempt for
 * @param tournamentId - The id of the tournament to save the attempt for
 * @param hasWon - Whether the user has won the tournament
 * @param claimedTxHash - The transaction hash of the claim
 * @returns
 */
export async function saveUserAttempt({
  userId,
  tournamentId,
  hasWon,
  claimedTxHash,
}: {
  userId: string;
  tournamentId: string;
  hasWon: boolean;
  claimedTxHash?: string;
}) {
  const [res] = await db
    .insert(userPrize)
    .values({
      userId,
      tournamentId,
      attempts: 1,
      prize: "0",
      wonAtAttempt: hasWon ? 1 : 0,
      claimedTxHash,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userPrize.userId, userPrize.tournamentId],
      set: {
        attempts: sql`${userPrize.attempts} + 1`,
        wonAtAttempt: hasWon
          ? sql`CASE 
              WHEN ${userPrize.wonAtAttempt} > 0 THEN MIN(${userPrize.wonAtAttempt}, ${userPrize.attempts} + 1)
              ELSE ${userPrize.attempts} + 1
            END`
          : userPrize.wonAtAttempt, // Keep existing value if not winning this time
        updatedAt: new Date(),
      },
    })
    .returning();
  return res ?? null;
}

export async function saveUserDeposit({
  userId,
  tournamentId,
  depositTxHash,
  depositAmount,
}: {
  userId: string;
  tournamentId: string;
  depositTxHash: string;
  depositAmount: string;
}) {
  const [res] = await db
    .insert(userPrize)
    .values({
      userId,
      tournamentId,
      prize: "0",
      depositTxHash,
      depositAmount,
      createdAt: new Date(),
    })
    .onConflictDoNothing()
    .returning();
  return res ?? null;
}

/**
 * Get a user's prize by tournament id and user id
 * @param tournamentId
 * @param userId - The id of the user to get the prize for
 * @returns The user's prize or null if the user's prize is not found
 */
export const getUserPrizeByTournamentId = async (
  tournamentId: string,
  userId: string
) => {
  const res = await db.query.userPrize.findFirst({
    where: and(
      eq(userPrize.tournamentId, tournamentId),
      eq(userPrize.userId, userId)
    ),
    with: {
      user: true,
    },
  });
  return res ?? null;
};

/**
 * Get all user prizes by tournament id
 * @param tournamentId - The id of the tournament to get
 * @returns The tournament or null if the tournament is not found
 */
export const getUserPrizesByTournamentId = async (tournamentId: string) => {
  const res = await db.query.userPrize.findMany({
    where: eq(userPrize.tournamentId, tournamentId),
    with: {
      user: true,
    },
    orderBy: [asc(userPrize.attempts)],
  });
  return res ?? null;
};
