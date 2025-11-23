import { useQuery } from "@tanstack/react-query";
import { type Address, createPublicClient, http } from "viem";
import { worldchain } from "viem/chains";
import { WORLD_IMPOSSIBLE_ADDRESS } from "@/lib/constants";
import { impossibleAbi } from "@/lib/contracts/abi";

// Create a public client for Base chain
const worldClient = createPublicClient({
  chain: worldchain,
  transport: http(),
});

type UseGetTournamentProps = {
  tournamentId: string;
  enabled?: boolean;
};

export const useGetTournamentOnchain = ({
  tournamentId,
  enabled = true,
}: UseGetTournamentProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tournament", tournamentId],
    enabled: enabled && !!tournamentId,
    queryFn: async (): Promise<{
      id: string;
      tournamentType: number;
      status: number;
      buyInToken: string;
      buyInAmount: number;
      prizePool: number;
      creator: string;
      createdAt: number;
      winner: string;
      merkleRoot: string;
    }> => {
      try {
        const tournament = await worldClient.readContract({
          address: WORLD_IMPOSSIBLE_ADDRESS as Address,
          abi: impossibleAbi,
          functionName: "getTournament",
          args: [BigInt(tournamentId)],
        });

        return {
          id: tournament.id.toString(),
          tournamentType: tournament.tournamentType,
          status: tournament.status,
          buyInToken: tournament.buyInToken,
          buyInAmount: Number(tournament.buyInAmount),
          prizePool: Number(tournament.prizePool),
          creator: tournament.creator,
          createdAt: Number(tournament.createdAt),
          winner: tournament.winner,
          merkleRoot: tournament.merkleRoot,
        };
      } catch (error1) {
        console.error("Error fetching USDC balance:", error1);
        throw error1;
      }
    },
  });

  return {
    data,
    isLoading,
    error,
  };
};
