import { NextResponse } from "next/server";
import { getUserPrizeByTournamentId } from "@/lib/database/queries/user-prize.query";
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
    const userPrize = await getUserPrizeByTournamentId(
      tournamentId,
      session.user.id
    );
    return NextResponse.json({ status: "ok", data: userPrize });
  } catch (error) {
    console.error("Error getting user prize", error);
    return NextResponse.json(
      { status: "nok", error: "Internal server error" },
      { status: 500 }
    );
  }
}
