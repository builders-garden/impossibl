"use client";

import { DaimoPayProvider } from "@daimo/pay";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { AudioProvider } from "@/contexts/audio-context";
import { AuthProvider } from "@/contexts/auth-context";
import { EnvironmentProvider } from "@/contexts/environment-context";
import { FarcasterProvider } from "@/contexts/farcaster-context";
import { wagmiConfigMiniApp } from "@/lib/wagmi";
import { ErudaProvider } from "./eruda";

const queryClient = new QueryClient();

export default function Providers({
  children,
  cookie,
}: {
  children: React.ReactNode;
  cookie: string | null;
}) {
  const initialState = cookieToInitialState(wagmiConfigMiniApp, cookie);
  return (
    <ErudaProvider>
      <AudioProvider>
        <WagmiProvider config={wagmiConfigMiniApp} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <DaimoPayProvider>
              <MiniKitProvider>
                <EnvironmentProvider>
                  <FarcasterProvider addMiniAppOnLoad={false}>
                    <AuthProvider>
                      <NuqsAdapter>{children}</NuqsAdapter>
                    </AuthProvider>
                  </FarcasterProvider>
                </EnvironmentProvider>
              </MiniKitProvider>
            </DaimoPayProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AudioProvider>
    </ErudaProvider>
  );
}
