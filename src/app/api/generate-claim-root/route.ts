import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { and, eq, inArray, isNotNull, ne } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import {
  type Address,
  createPublicClient,
  createWalletClient,
  formatUnits,
  getAddress,
  http,
  parseEventLogs,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { worldchain } from "viem/chains";
import { IMPOSSIBLE_ADDRESS, WORLD_WLD_ADDRESS } from "@/lib/constants";
import { impossibleAbi } from "@/lib/contracts/abi";
import { db } from "@/lib/database";
import {
  tournament,
  user,
  userPrize,
  walletAddress,
} from "@/lib/database/db.schema";
import { createTournament } from "@/lib/database/queries/tournament.query";
import { env } from "@/lib/env";

// Create a public client for Worldchain
const worldchainClient = createPublicClient({
  chain: worldchain,
  transport: http(),
});

// wallet client
const worldchainWalletClient = createWalletClient({
  chain: worldchain,
  transport: http(),
});

/**
 * Calculate prize distribution based on wonAtAttempt
 * Earlier attempts (lower numbers) get significantly higher prizes
 * Uses exponential inverse weighting to heavily favor top winners
 * For large winner counts (100+), uses a tiered approach to ensure lower winners still get meaningful prizes
 */
function calculatePrizeDistribution(
  winners: Array<{ wonAtAttempt: number }>,
  totalPrizePool: number
): Array<{ prize: number }> {
  if (winners.length === 0) {
    return [];
  }

  // For large winner counts, use a less aggressive curve to ensure lower winners get something
  // For smaller counts, use the steeper exponential curve
  const useTieredDistribution = winners.length > 100;

  let weights: number[];

  if (useTieredDistribution) {
    // Tiered approach for large winner counts:
    // - Top 10: Use 1/n^1.3 (targets ~40% of prize pool)
    // - Next 40 (11-50): Use 1/n^1.2 (gentle exponential)
    // - Rest (51+): Use 1/n (gentle curve, ensures everyone gets something)
    weights = winners.map((w, index) => {
      const position = index + 1;
      if (position <= 10) {
        // Top 10: gentle exponential (targets ~40% of total pool)
        return 1 / w.wonAtAttempt ** 1.3;
      }
      if (position <= 50) {
        // Next 40: gentle exponential
        return 1 / w.wonAtAttempt ** 1.2;
      }
      // Rest: gentle curve
      return 1 / w.wonAtAttempt;
    });
  } else {
    // For smaller winner counts, use gentle exponential inverse weighting
    // Formula: 1 / (wonAtAttempt^1.3) - balanced distribution
    weights = winners.map((w) => 1 / w.wonAtAttempt ** 1.3);
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Distribute prizes proportionally
  const prizes = weights.map((weight) => ({
    prize: Math.floor((weight / totalWeight) * totalPrizePool),
  }));

  // Ensure minimum prize of 1 token for all winners (if prize pool allows)
  // This prevents winners from getting 0 tokens due to rounding
  const totalDistributed = prizes.reduce((sum, p) => sum + p.prize, 0);
  const remaining = totalPrizePool - totalDistributed;

  // Distribute remaining tokens to ensure minimum of 1 token per winner
  if (remaining > 0) {
    for (let i = 0; i < prizes.length && remaining > 0; i += 1) {
      const prize = prizes[i];
      if (prize && prize.prize === 0) {
        prize.prize = 1;
      }
    }
  }

  return prizes;
}

export async function GET(_request: NextRequest) {
  try {
    // TODO get tournamentId from database
    const tournamentId = "1";

    // 1. Read prize pool from smart contract on Worldchain
    let prizePool: number;
    try {
      const contractTournament = await worldchainClient.readContract({
        address: IMPOSSIBLE_ADDRESS as Address,
        abi: impossibleAbi,
        functionName: "getTournament",
        args: [BigInt(tournamentId)],
      });

      // Extract prizePool from the tournament struct
      const rawPrizePool = contractTournament.prizePool;

      // Format from wei (18 decimals) to tokens
      const formattedPrizePool = formatUnits(rawPrizePool, 18);
      prizePool = Number.parseFloat(formattedPrizePool);
    } catch (error) {
      console.error("Error reading tournament from contract:", error);
      return NextResponse.json(
        {
          error: "Failed to read tournament from contract",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 2. Read tournament from DB and check if merkleRoot is not set yet
    const tournamentData = await db.query.tournament.findFirst({
      where: eq(tournament.id, tournamentId),
    });

    if (!tournamentData) {
      return NextResponse.json(
        { error: "Tournament not found in database" },
        { status: 404 }
      );
    }

    // Check if merkleRoot is already set (check for null, empty string, or empty array)
    const existingMerkleRoot = tournamentData.merkleRoot;
    if (
      existingMerkleRoot &&
      ((typeof existingMerkleRoot === "string" &&
        existingMerkleRoot.trim() !== "") ||
        (Array.isArray(existingMerkleRoot) && existingMerkleRoot.length > 0))
    ) {
      return NextResponse.json(
        { error: "Merkle root already generated for this tournament" },
        { status: 400 }
      );
    }

    // 3. Read from userPrize - get all users with wonAtAttempt != 0, ordered by wonAtAttempt
    const winnersRaw = await db
      .select({
        userId: userPrize.userId,
        wonAtAttempt: userPrize.wonAtAttempt,
      })
      .from(userPrize)
      .where(
        and(
          eq(userPrize.tournamentId, tournamentId),
          isNotNull(userPrize.wonAtAttempt),
          ne(userPrize.wonAtAttempt, 0)
        )
      )
      .orderBy(userPrize.wonAtAttempt);

    // Filter out null values and ensure wonAtAttempt is a number
    const winners = winnersRaw.filter(
      (w): w is { userId: string; wonAtAttempt: number } =>
        w.wonAtAttempt !== null && w.wonAtAttempt !== 0
    );

    if (winners.length === 0) {
      return NextResponse.json(
        { error: "No winners found for this tournament" },
        { status: 400 }
      );
    }

    // 4. Get wallet addresses for all winners
    const userIds = winners.map((w) => w.userId);
    const users = await db.select().from(user).where(inArray(user.id, userIds));

    const walletAddresses = await db
      .select()
      .from(walletAddress)
      .where(inArray(walletAddress.userId, userIds));

    // Create a map of userId -> wallet address (prefer primary, then minikitAddress, then first wallet)
    const userAddressMap = new Map<string, string>();
    for (const u of users) {
      if (u.minikitAddress) {
        userAddressMap.set(u.id, u.minikitAddress);
      }
    }
    for (const wa of walletAddresses) {
      if (!userAddressMap.has(wa.userId)) {
        userAddressMap.set(wa.userId, wa.address);
      }
    }

    // 5. Calculate prize distribution using prize pool from contract
    const prizeDistribution = calculatePrizeDistribution(winners, prizePool);

    // 6. Generate merkleValues array: [address, prizeAmount]
    const merkleValues: [string, string][] = [];
    for (let i = 0; i < winners.length; i += 1) {
      const winner = winners[i];
      const address = userAddressMap.get(winner.userId);

      if (!address) {
        console.warn(
          `No wallet address found for user ${winner.userId}, skipping`
        );
        continue;
      }

      const prizeAmount = prizeDistribution[i]?.prize || 0;
      if (prizeAmount > 0) {
        merkleValues.push([address.toLowerCase(), prizeAmount.toString()]);
      }
    }

    if (merkleValues.length === 0) {
      return NextResponse.json(
        { error: "No valid winners with wallet addresses found" },
        { status: 400 }
      );
    }

    // 7. Generate merkleRoot from merkleValues
    const tree = StandardMerkleTree.of(merkleValues, ["address", "uint256"]);
    const merkleRoot = tree.root;

    // 8. Store merkleValues and merkleRoot in the database
    await db
      .update(tournament)
      .set({
        merkleRoot,
        merkleValues,
      })
      .where(eq(tournament.id, tournamentId));

    // generate and save global tournament for new day
    const account = privateKeyToAccount(env.BACKEND_PRIVATE_KEY);
    const txHash = await worldchainWalletClient.writeContract({
      account,
      address: IMPOSSIBLE_ADDRESS as Address,
      abi: impossibleAbi,
      functionName: "createGlobalTournament",
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
    const newTournamentId = tournamentCreatedEvent[0].args.tournamentId;
    console.log("tournamentId", tournamentId);

    // save new tournament in db
    const getTodayDayMonth = new Date().toISOString().split("T")[0];
    await createTournament({
      id: newTournamentId.toString(),
      name: `Daily #${getTodayDayMonth}`,
      type: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      merkleRoot: null,
      merkleValues: null,
      prizePool: 1,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      root: merkleRoot,
      merkleValues,
      winnersCount: merkleValues.length,
      message: "Merkle tree generated and stored successfully",
    });
  } catch (error) {
    console.error("Error generating Merkle tree:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to generate Merkle tree",
      },
      { status: 500 }
    );
  }
}
