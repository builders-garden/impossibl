"use client";

import Link from "next/link";
import { Website } from "@/components/pages/website";
import { BaseIcon } from "@/components/shared/icons/base-icon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useFarcaster } from "@/contexts/farcaster-context";
import { env } from "@/lib/env";

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();
  const { context } = useFarcaster();
  const isInFarcasterMobile =
    !isInBrowser && context?.client?.platformType === "mobile";

  const baseUrl = isInFarcasterMobile
    ? `cbwallet://miniapp?url=${encodeURIComponent(env.NEXT_PUBLIC_URL)}`
    : env.NEXT_PUBLIC_URL;

  if (isInBrowser) {
    return <Website />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div className="mx-auto flex size-full max-w-md flex-col gap-2 overflow-x-hidden px-2">
      <div className="w-full max-w-md self-center">Hi {user?.name}</div>

      <Button
        asChild
        className="w-full bg-[#00F] hover:bg-[#00F]/80"
        variant="default"
      >
        <Link className="w-full" href={new URL(baseUrl)} target="_blank">
          <span className="font-medium text-xl">Chat on</span>
          <BaseIcon className="h-16 w-16 fill-white" />
          <span className="font-medium text-xl">Base</span>
        </Link>
      </Button>
    </div>
  );
}
