import { getDefaultConfig } from "@daimo/pay";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { http } from "viem";
import { basePreconf, mainnet, worldchain } from "viem/chains";
import { createConfig } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { env } from "@/lib/env";

// Create wagmi config with all required chains
export const wagmiConfigMiniApp = createConfig(
  getDefaultConfig({
    appName: "Impossibl",
    appIcon: `${env.NEXT_PUBLIC_URL}/images/icon.png`,
    appDescription: "Impossibl",
    appUrl: env.NEXT_PUBLIC_URL,
    ssr: undefined,
    chains: [mainnet, basePreconf, worldchain],
    transports: {
      [mainnet.id]: http(),
      [basePreconf.id]: http(),
      [worldchain.id]: http(),
    },
    connectors: [miniAppConnector(), coinbaseWallet()],
  })
);
