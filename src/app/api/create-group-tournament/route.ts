import { NextResponse } from "next/server";
import {
  type Address,
  createPublicClient,
  createWalletClient,
  getAddress,
  http,
  parseEventLogs,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchain } from "viem/chains";
import { IMPOSSIBLE_ADDRESS, WORLD_WLD_ADDRESS } from "@/lib/constants";
import { impossibleAbi } from "@/lib/contracts/abi";
import { createTournament } from "@/lib/database/queries/tournament.query";
import { env } from "@/lib/env";
import type { CreateGroupTournamentReturnSchema } from "@/types/create-group-tournament.type";

export async function POST(): Promise<
  NextResponse<CreateGroupTournamentReturnSchema>
> {
  try {
    console.log("createGroupTournament");

    // Create wallet client for Worldchain
    const worldchainWalletClient = createWalletClient({
      chain: worldchain,
      transport: http(),
    });
    const worldchainClient = createPublicClient({
      chain: worldchain,
      transport: http(),
    });

    // Create account from backend private key
    const account = privateKeyToAccount(env.BACKEND_PRIVATE_KEY);

    // Call createGroupTournament function
    const txHash = await worldchainWalletClient.writeContract({
      account,
      address: IMPOSSIBLE_ADDRESS as Address,
      abi: impossibleAbi,
      functionName: "createGroupTournament",
      args: [getAddress(WORLD_WLD_ADDRESS as Address), parseUnits("1", 18)],
    });

    console.log("txHash", txHash);
    const txReceipt = await worldchainClient.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("txReceipt found");
    const tournamentCreatedEvent = parseEventLogs({
      abi: impossibleAbi,
      logs: txReceipt.logs,
      eventName: "TournamentCreated",
    });
    const tournamentId = tournamentCreatedEvent[0].args.tournamentId;
    console.log("tournamentId", tournamentId);

    // save tournament in db
    await createTournament({
      id: tournamentId.toString(),
      name: `Ganggg #${tournamentId}`,
      type: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      merkleRoot: null,
      merkleValues: null,
      prizePool: 1,
      createdAt: new Date(),
    });

    return NextResponse.json({
      status: "ok",
      data: {
        txHash,
        tournamentId: tournamentId.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating group tournament:", error);
    return NextResponse.json(
      {
        status: "nok",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to create group tournament",
      },
      { status: 500 }
    );
  }
}
