import { sql } from "drizzle-orm";
import { db } from "@/lib/database";
import { userPrize } from "@/lib/database/db.schema";

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
      wonAtAttempt: hasWon ? 1 : null,
      claimedTxHash,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userPrize.userId, userPrize.tournamentId],
      set: {
        attempts: sql`${userPrize.attempts} + 1`,
        updatedAt: new Date(),
      },
    })
    .returning();
  return res ?? null;
}
