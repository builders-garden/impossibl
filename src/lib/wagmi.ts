import { getDefaultConfig } from "@daimo/pay";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { http } from "viem";
import { celo, worldchain } from "viem/chains";
import { createConfig } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { env } from "@/lib/env";

// Create wagmi config with all required chains
export const wagmiConfigMiniApp = createConfig(
  getDefaultConfig({
    appName: env.NEXT_PUBLIC_APPLICATION_NAME,
    appIcon: `${env.NEXT_PUBLIC_URL}/images/icon.png`,
    appDescription: env.NEXT_PUBLIC_APPLICATION_DESCRIPTION,
    appUrl: env.NEXT_PUBLIC_URL,
    ssr: undefined,
    chains: [celo, worldchain],
    transports: {
      [celo.id]: http(),
      [worldchain.id]: http(),
    },
    connectors: [miniAppConnector(), coinbaseWallet()],
  })
);
