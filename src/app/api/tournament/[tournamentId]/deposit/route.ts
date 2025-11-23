import { NextResponse } from "next/server";
import { getTournamentById } from "@/lib/database/queries/tournament.query";
import { saveUserDeposit } from "@/lib/database/queries/user-prize.query";
import {
  type BackendReturnSchema,
  saveDepositVariablesSchema as schema,
} from "@/types/save-deposit.type";
import { getServerSession } from "@/utils/better-auth";

export async function POST(
  request: Request
): Promise<NextResponse<BackendReturnSchema>> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.error("[deposit/POST] Invalid request body", parsed.error);
      return NextResponse.json(
        { status: "nok", error: parsed.error.message },
        { status: 400 }
      );
    }
    const { tournamentId, txHash, amount } = parsed.data;

    const session = await getServerSession();
    if (!session) {
      console.error("No session, redirecting to sign-in");
      return NextResponse.json(
        { status: "nok", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tournament = await getTournamentById(tournamentId);
    if (!tournament) {
      console.error("Tournament not found");
      return NextResponse.json(
        { status: "nok", error: "Tournament not found" },
        { status: 404 }
      );
    }

    // save user deposit also on the db for faster data retrieval
    const userPrize = await saveUserDeposit({
      userId: session.user.id,
      tournamentId: body.tournamentId,
      depositTxHash: txHash,
      depositAmount: amount.toString(),
    });
    return NextResponse.json(
      { status: "ok", data: { userPrize } },
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
