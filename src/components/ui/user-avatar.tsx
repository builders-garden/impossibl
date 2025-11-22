import { CircleUserIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils";

type AvatarSize = "xs" | "xsm" | "sm" | "md" | "lg" | "xl"; // xsm is the new in-between size (24px)

const SIZE_CLASS: Record<AvatarSize, string> = {
  xs: "h-5 w-5", // 20px
  xsm: "h-7 w-7", // 24px (new)
  sm: "h-8 w-8", // 32px
  md: "h-10 w-10", // 40px
  lg: "h-12 w-12", // 48px
  xl: "h-14 w-14", // 56px
};

type UserAvatarProps = {
  avatarUrl: string | null;
  size: AvatarSize;
  className?: string;
  alt?: string;
};

export function UserAvatar({
  avatarUrl,
  size,
  className,
  alt,
}: UserAvatarProps) {
  const sizeClasses = SIZE_CLASS[size] ?? SIZE_CLASS.sm;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        sizeClasses,
        className
      )}
    >
      {avatarUrl ? (
        <Image
          alt={alt || "User avatar"}
          className="h-full w-full object-cover"
          fill
          sizes="100px"
          src={avatarUrl}
        />
      ) : (
        <CircleUserIcon className="mx-auto my-auto h-1/2 w-1/2 text-muted-foreground" />
      )}
    </div>
  );
}
