import { NextResponse } from "next/server";
import { getTournamentById } from "@/lib/database/queries/tournament.query";
import { saveUserAttempt } from "@/lib/database/queries/user-prize.query";
import {
  type BackendReturnSchema,
  saveAttemptVariablesSchema as schema,
} from "@/types/save-attempt.type";
import { getServerSession } from "@/utils/better-auth";

export async function POST(
  request: Request
): Promise<NextResponse<BackendReturnSchema>> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.error("[attempts/POST] Invalid request body", parsed.error);
      return NextResponse.json(
        { status: "nok", error: parsed.error.message },
        { status: 400 }
      );
    }
    const { hasWon } = parsed.data;

    const session = await getServerSession();
    if (!session) {
      console.error("No session, redirecting to sign-in");
      return NextResponse.json(
        { status: "nok", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tournament = await getTournamentById(body.tournamentId);
    if (!tournament) {
      console.error("Tournament not found");
      return NextResponse.json(
        { status: "nok", error: "Tournament not found" },
        { status: 404 }
      );
    }

    // if tournament type is group (1) and tournament doesnt have winner yet
    if (tournament.type === 1 && hasWon && !tournament.winner) {
      // TODO sendTx from backend to send prize to winner automatically
      const claimedTxHash = "0x";
      const userAttempt = await saveUserAttempt({
        userId: session.user.id,
        tournamentId: body.tournamentId,
        hasWon,
        claimedTxHash,
      });
      return NextResponse.json(
        { status: "ok", data: { attempts: userAttempt.attempts } },
        { status: 200 }
      );
    }

    // tournament either is daily (0) or group already has winner, just save attempt
    const userPrize = await saveUserAttempt({
      userId: session.user.id,
      tournamentId: body.tournamentId,
      hasWon,
    });

    return NextResponse.json(
      { status: "ok", data: { attempts: userPrize.attempts } },
      { status: 200 }
    );
  } catch (error) {
    console.error("[attempts/POST] Error", error);
    return NextResponse.json(
      {
        status: "nok",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
