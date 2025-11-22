import { useQuery } from "@tanstack/react-query";
import { getETHPriceUSD } from "@/lib/lifi";

/**
 * Hook to fetch ETH price in USD
 * First tries to get it from user's wallet balance data, then falls back to fetching from token list
 * @param walletBalanceData Optional wallet balance data to extract ETH price from
 * @returns Query result with ETH price in USD
 */
export function useETHPrice() {
  return useQuery<number | null>({
    queryKey: ["ethPrice"],
    queryFn: async () => {
      try {
        return await getETHPriceUSD();
      } catch (error) {
        console.error("Error fetching ETH price from token list:", error);
        return null;
      }
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}
