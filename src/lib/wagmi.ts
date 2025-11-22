import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { http } from "viem";
import { basePreconf, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

// Create wagmi config with all required chains
export const wagmiConfigMiniApp = createConfig({
  ssr: undefined,
  chains: [mainnet, basePreconf],
  transports: {
    [mainnet.id]: http(),
    [basePreconf.id]: http(),
  },
  connectors: [miniAppConnector(), coinbaseWallet()],
});
