"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cookieToInitialState, WagmiProvider } from "wagmi";
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
      <WagmiProvider config={wagmiConfigMiniApp} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider>
            <EnvironmentProvider>
              <FarcasterProvider addMiniAppOnLoad={false}>
                <AuthProvider>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </AuthProvider>
              </FarcasterProvider>
            </EnvironmentProvider>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErudaProvider>
  );
}
