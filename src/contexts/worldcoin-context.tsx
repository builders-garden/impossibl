"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type WorldcoinContextType = {
  isWorldcoinMiniAppReady: boolean;
  isInWorldcoinMiniApp: boolean;
  error: string | null;
};

export const WorldcoinContext = createContext<WorldcoinContextType | undefined>(
  undefined
);

export function useWorldcoin() {
  const context = useContext(WorldcoinContext);
  if (context === undefined) {
    throw new Error("useWorldcoin must be used within a WorldcoinProvider");
  }
  return context;
}

export function WorldcoinProvider({ children }: { children: ReactNode }) {
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isMiniAppReady, setIsMiniAppReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorldcoinMiniApp = useCallback(() => {
    try {
      // check if the app is in the miniapp
      const tmpIsInMiniApp = MiniKit.isInstalled(true);
      setIsInMiniApp(tmpIsInMiniApp);

      // if the app is installed, set the miniapp as ready
      if (tmpIsInMiniApp) {
        setIsMiniAppReady(true);
      } else {
        setError("Failed to load Worldcoin MiniApp");
        setIsInMiniApp(false);
      }
    } catch (err) {
      console.error("SDK initialization error:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize SDK");
    }
  }, []);

  useEffect(() => {
    if (!isMiniAppReady) {
      loadWorldcoinMiniApp();
    }
  }, [isMiniAppReady, loadWorldcoinMiniApp]);

  return (
    <WorldcoinContext.Provider
      value={{
        isInWorldcoinMiniApp: isInMiniApp,
        isWorldcoinMiniAppReady: isMiniAppReady,
        error,
      }}
    >
      {children}
    </WorldcoinContext.Provider>
  );
}
