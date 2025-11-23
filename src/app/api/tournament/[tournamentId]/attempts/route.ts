import { NextResponse } from "next/server";
import { type Address, createWalletClient, getAddress, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchain } from "viem/chains";
import { IMPOSSIBLE_ADDRESS } from "@/lib/constants";
import { impossibleAbi } from "@/lib/contracts/abi";
import { getTournamentById } from "@/lib/database/queries/tournament.query";
import { getUserFromId } from "@/lib/database/queries/user.query";
import { saveUserAttempt } from "@/lib/database/queries/user-prize.query";
import { env } from "@/lib/env";
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
      // Get user's minikitAddress
      const user = await getUserFromId(session.user.id);
      if (!user?.minikitAddress) {
        return NextResponse.json(
          { status: "nok", error: "User wallet address not found" },
          { status: 400 }
        );
      }

      // Send transaction from backend to set winner and distribute prize
      const worldchainWalletClient = createWalletClient({
        chain: worldchain,
        transport: http(),
      });
      const distributePrize = await worldchainWalletClient.writeContract({
        address: IMPOSSIBLE_ADDRESS as Address,
        abi: impossibleAbi,
        functionName: "setGroupWinner",
        args: [
          BigInt(tournament.id),
          getAddress(user.minikitAddress as Address),
        ],
        account: privateKeyToAccount(env.BACKEND_PRIVATE_KEY),
      });
      const claimedTxHash = distributePrize;
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
