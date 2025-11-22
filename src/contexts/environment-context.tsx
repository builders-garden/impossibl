import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type EnvironmentContextType = {
  isInBrowser: boolean;
  isInFarcasterMiniApp: boolean;
  isInWorldcoinMiniApp: boolean;
  isLoading: boolean;
};

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined
);

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error(
      "useEnvironment must be used within an EnvironmentProvider"
    );
  }
  return context;
};

type EnvironmentProviderProps = {
  children: ReactNode;
};

export const EnvironmentProvider = ({ children }: EnvironmentProviderProps) => {
  const [isInFarcasterMiniApp, setIsInFarcasterMiniApp] = useState(false);
  const { isInstalled: isInWorldMinikit } = useMiniKit();
  const [isInWorldcoinMiniApp, setIsInWorldcoinMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInBrowser, setIsInBrowser] = useState(false);

  useLayoutEffect(() => {
    const checkEnvironment = async () => {
      try {
        const inWorldcoinMiniApp = isInWorldMinikit ?? false;
        setIsInWorldcoinMiniApp(inWorldcoinMiniApp);
        const inFarcasterMiniApp = await miniappSdk.isInMiniApp();
        setIsInFarcasterMiniApp(inFarcasterMiniApp);
        const tmpIsInBrowser = !(inWorldcoinMiniApp || inFarcasterMiniApp);
        setIsInBrowser(tmpIsInBrowser);
      } catch (error) {
        console.error("[environment] Error checking environment", error);
        setIsInWorldcoinMiniApp(false);
        setIsInFarcasterMiniApp(false);
        setIsInBrowser(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkEnvironment();
  }, [isInWorldMinikit]);

  const value: EnvironmentContextType = {
    isInFarcasterMiniApp,
    isInWorldcoinMiniApp,
    isLoading,
    isInBrowser,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};
