import { useQuery } from "@tanstack/react-query";
import { type Address, createPublicClient, getAddress, http } from "viem";
import { worldchain } from "viem/chains";
import { IMPOSSIBLE_ADDRESS } from "@/lib/constants";
import { impossibleAbi } from "@/lib/contracts/abi";

// Create a public client for Base chain
const worldClient = createPublicClient({
  chain: worldchain,
  transport: http(),
});

type UseCheckDepositProps = {
  tournamentId: string;
  address?: Address;
  enabled?: boolean;
};

export const useCheckDeposit = ({
  address,
  tournamentId,
  enabled = true,
}: UseCheckDepositProps) => {
  const {
    data: hasJoined,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["check-has-joined", tournamentId, address],
    enabled: enabled && !!address && !!tournamentId,
    queryFn: async (): Promise<boolean> => {
      if (!address) {
        throw new Error("Address is required");
      }

      try {
        const hasJoinedResult = await worldClient.readContract({
          address: IMPOSSIBLE_ADDRESS as Address,
          abi: impossibleAbi,
          functionName: "hasJoined",
          args: [BigInt(tournamentId), getAddress(address)],
        });

        return hasJoinedResult;
      } catch (error1) {
        console.error("Error fetching USDC balance:", error1);
        throw error1;
      }
    },
  });

  return {
    hasJoined,
    isLoading,
    error,
  };
};
