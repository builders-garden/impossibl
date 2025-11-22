import { type Address, encodeFunctionData } from "viem";
import { impossibleAbi } from "./abi";

/**
 * Encodes function data for the joinTournament function
 * @param tournamentId - The tournament ID to join
 * @param player - The address of the player joining the tournament
 * @returns The encoded function data as a hex string
 */
export function encodeJoinTournamentData(
  tournamentId: bigint,
  player: Address
): `0x${string}` {
  return encodeFunctionData({
    abi: impossibleAbi,
    functionName: "joinTournament",
    args: [tournamentId, player],
  });
}

/**
 *
 * @param buyInToken - The token to use for the buy in
 * @param buyInAmount
 * @returns
 */
export function generateTournamentForNewDay(
  buyInToken: Address,
  buyInAmount: bigint
) {
  return encodeFunctionData({
    abi: impossibleAbi,
    functionName: "createGlobalTournament",
    args: [buyInToken, buyInAmount],
  });
}
