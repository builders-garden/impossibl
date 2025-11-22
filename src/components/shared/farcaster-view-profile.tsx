import Link from "next/link";
import { FarcasterIcon } from "@/components/shared/icons/farcaster-icon";
import { useFarcaster } from "@/contexts/farcaster-context";
import { cn } from "@/utils";
import { openFarcasterProfile } from "@/utils/farcaster";

type FarcasterViewProfileProps = {
  text?: string;
  farcasterFid?: number;
  farcasterUsername?: string;
  className?: string;
  showLogo?: boolean;
};

export const FarcasterViewProfile = ({
  text = "View Profile",
  farcasterFid,
  farcasterUsername,
  className,
  showLogo = true,
}: FarcasterViewProfileProps) => {
  const { context } = useFarcaster();

  return (
    <div className="flex w-fit items-center justify-start">
      {context ? (
        <p
          className={cn(
            "flex cursor-pointer items-center justify-center gap-1 text-center text-black text-md",
            className
          )}
          onClick={() => openFarcasterProfile(farcasterFid ?? 2)}
        >
          {text}
          {showLogo && <FarcasterIcon className="h-[16px] w-[16px]" />}
        </p>
      ) : (
        <Link
          className={cn(
            "flex w-full cursor-pointer items-center justify-center gap-1 text-center text-black text-md underline",
            className
          )}
          href={`https://farcaster.xyz/${farcasterUsername ?? ""}`}
          target="_blank"
        >
          {text}
          {showLogo && <FarcasterIcon className="h-[16px] w-[16px]" />}
        </Link>
      )}
    </div>
  );
};
