"use client";

// components
import {
  CircleUserRoundIcon,
  Loader2Icon,
  LogInIcon,
  Volume2Icon,
} from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useFarcaster } from "@/contexts/farcaster-context";
import { formatAvatarSrc, getInitials } from "@/utils";

export const UserProfile = () => {
  const { isInFarcasterMiniApp, isInWorldcoinMiniApp } = useEnvironment();
  const { context } = useFarcaster();
  const { user, isAuthenticated, isLoading: isSigningIn } = useAuth();
  const { isConnected } = useAccount();

  const isDisabled =
    !isInFarcasterMiniApp && (isSigningIn || (isConnected && isAuthenticated));

  const pfpUrl =
    isInFarcasterMiniApp && context?.user.pfpUrl
      ? formatAvatarSrc(context.user.pfpUrl)
      : user?.image
        ? formatAvatarSrc(user.image)
        : null;

  return (
    <div className="flex flex-row items-center gap-2 tracking-tight">
      <Button size="icon" variant="ghost">
        <Volume2Icon className="h-full w-full" />
      </Button>
      {isInFarcasterMiniApp || isInWorldcoinMiniApp ? (
        <Button
          asChild
          className={
            "h-12 w-12 rounded-xl bg-transparent p-0 transition-all hover:bg-transparent"
          }
          disabled={isDisabled}
          size="icon"
          variant="ghost"
        >
          <Link href={user ? `/profile/${user.id}` : "/"}>
            {isAuthenticated ? (
              pfpUrl ? (
                <UserAvatar avatarUrl={pfpUrl} className="size-8" size="sm" />
              ) : (
                <div className="size-7 rounded-full text-muted-foreground text-sm">
                  {user?.name ? getInitials(user.name) : ""}
                </div>
              )
            ) : isSigningIn ? (
              <div className="flex size-8 items-center justify-center rounded-full">
                <Loader2Icon className="size-5 animate-spin" />
              </div>
            ) : isConnected ? (
              <CircleUserRoundIcon className="size-5" />
            ) : (
              <LogInIcon className="size-5" />
            )}
          </Link>
        </Button>
      ) : null}
    </div>
  );
};
