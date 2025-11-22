import { CircleUserIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { FarcasterViewProfile } from "@/components/shared/farcaster-view-profile";
import { ShareButton } from "@/components/shared/share-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@/lib/env";
import type { User } from "@/types/user.type";
import { formatAvatarSrc } from "@/utils";
import { createFarcasterIntentUrl } from "@/utils/farcaster";

type ProfileHeaderProps = {
  user?: User;
};

const motionBaseDelay = 0.125;

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { user: currentUser } = useAuth();
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShareProfile = () => {
    if (!user) {
      return;
    }
    createFarcasterIntentUrl(
      `Check out my profile @${user.name}`,
      `${env.NEXT_PUBLIC_URL}/profile/${user.id}`
    );
  };

  return (
    <div className="flex w-full flex-col gap-4 py-2">
      <div className="flex w-full items-center justify-start">
        {/* Profile picture and name */}
        <div className="flex w-full items-center gap-1">
          {/* Profile picture */}
          {user ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="relative"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: motionBaseDelay }}
            >
              <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full">
                {user.image ? (
                  <Image
                    alt="Profile Picture"
                    className="h-[76px] w-[76px] rounded-full object-cover"
                    height={76}
                    src={formatAvatarSrc(user.image)}
                    width={76}
                  />
                ) : (
                  <CircleUserIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </motion.div>
          ) : (
            <Skeleton className="h-[86px] w-[86px] rounded-full bg-[#323232]" />
          )}

          {/* Username and joined date */}
          {user ? (
            <div className="flex w-full justify-between gap-1">
              <div className="flex w-full flex-col gap-1">
                <motion.h1
                  animate={{ opacity: 1 }}
                  className="flex items-start justify-between gap-2 font-semibold text-2xl"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: motionBaseDelay * 2,
                  }}
                >
                  <FarcasterViewProfile
                    farcasterFid={user.farcasterFid ?? undefined}
                    farcasterUsername={user.farcasterUsername ?? undefined}
                    showLogo={false}
                    text={
                      user
                        ? user.farcasterDisplayName
                          ? user.farcasterDisplayName.length > 14
                            ? `${user.farcasterDisplayName?.slice(0, 10)}...`
                            : `${user.farcasterDisplayName}`
                          : (user.farcasterUsername ?? undefined)
                        : "unknown"
                    }
                  />
                </motion.h1>
                <span className="text-muted-foreground text-sm">
                  Joined{" "}
                  {new Date(user?.createdAt ?? "").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {currentUser && currentUser.id === user.id ? (
                <div className="flex items-center justify-end">
                  <ShareButton
                    buttonSize="icon"
                    handleShare={handleShareProfile}
                    linkCopied={linkCopied}
                    miniappUrl={`${env.NEXT_PUBLIC_URL}/profile/${user.id}`}
                    navigatorText={`Check out my profile: @${user.farcasterUsername}`}
                    navigatorTitle={`${env.NEXT_PUBLIC_APPLICATION_NAME} profile`}
                    setLinkCopied={setLinkCopied}
                    side="left"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex w-full flex-col gap-1">
              <Skeleton className="h-[28px] w-[150px] rounded-lg bg-[#323232]" />
              <Skeleton className="h-[18px] w-[120px] rounded-lg bg-[#323232]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
