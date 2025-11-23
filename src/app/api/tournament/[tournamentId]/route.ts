import { NextResponse } from "next/server";
import { getUserPrizesByTournamentId } from "@/lib/database/queries/user-prize.query";
import { getServerSession } from "@/utils/better-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tournamentId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      console.error("No session, redirecting to sign-in");
      return NextResponse.json(
        { status: "nok", error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { tournamentId } = await params;
    const userPrizes = await getUserPrizesByTournamentId(tournamentId);
    return NextResponse.json({ status: "ok", data: userPrizes });
  } catch (error) {
    console.error("Error getting user prize", error);
    return NextResponse.json(
      { status: "nok", error: "Internal server error" },
      { status: 500 }
    );
  }
}
