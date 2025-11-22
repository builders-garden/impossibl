"use client";

import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { createContext, type ReactNode, useContext, useEffect } from "react";
import { basePreconf } from "viem/chains";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import type { FarcasterUser } from "@/types/user.type";
import { useEnvironment } from "./environment-context";

export type AppContextType = {
  activeFarcasterUser: FarcasterUser | null;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
}

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const { isConnected, address, chainId } = useAccount();
  const { connect, error: connectError } = useConnect();
  const { switchChain } = useSwitchChain();
  const { isInFarcasterMiniApp: isInMiniApp } = useEnvironment();

  // handle wagmi connection errors
  useEffect(() => {
    if (connectError) {
      console.error("wagmi connection error", connectError);
    }
  }, [connectError]);

  // always connect to wagmi farcaster miniapp to retrieve wallet address
  useEffect(() => {
    if (!(isConnected && address)) {
      if (isInMiniApp) {
        connect({ connector: miniAppConnector() });
      }
      return;
    }
  }, [isConnected, address, isInMiniApp, connect]);

  // connect to base (preconf)
  useEffect(() => {
    if (isConnected && !!chainId && chainId !== basePreconf.id) {
      switchChain({ chainId: basePreconf.id });
    }
  }, [isConnected, chainId, switchChain]);

  return (
    <AppContext.Provider
      value={{
        activeFarcasterUser: null,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
