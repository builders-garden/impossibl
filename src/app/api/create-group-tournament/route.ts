import { NextResponse } from "next/server";
import {
  type Address,
  createWalletClient,
  getAddress,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchain } from "viem/chains";
import { IMPOSSIBLE_ADDRESS, WORLD_WLD_ADDRESS } from "@/lib/constants";
import { impossibleAbi } from "@/lib/contracts/abi";
import { env } from "@/lib/env";

export async function POST() {
  try {
    // Create wallet client for Worldchain
    const worldchainWalletClient = createWalletClient({
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

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      message: "Group tournament creation transaction submitted successfully",
    });
  } catch (error) {
    console.error("Error creating group tournament:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to create group tournament",
      },
      { status: 500 }
    );
  }
}
