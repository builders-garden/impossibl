import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import { CheckIcon, CopyIcon, Share2Icon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { FarcasterIcon } from "@/components/shared/icons/farcaster-icon";
import { TwitterIcon } from "@/components/shared/icons/twitter-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, copyToClipboard, createTwitterIntentUrl } from "@/utils";

type ShareButtonProps = {
  side?: "left" | "right" | "top" | "bottom" | undefined;
  buttonVariant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  buttonSize?: "sm" | "default" | "lg" | "icon" | null | undefined;
  buttonText?: string;
  buttonClassName?: string;
  navigatorTitle?: string;
  navigatorText?: string;
  miniappUrl: string;
  linkCopied: boolean;
  setLinkCopied: Dispatch<SetStateAction<boolean>>;
  handleShare?: () => void;
};

export const ShareButton = ({
  side = "top",
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonText = "Share",
  buttonClassName,
  navigatorTitle = "Imagine!",
  navigatorText = "Check out this imagine",
  miniappUrl,
  linkCopied,
  setLinkCopied,
  handleShare,
}: ShareButtonProps) => {
  const handleShareToFarcaster = () => {
    handleShare?.();
  };

  const handleShareToTwitter = async () => {
    const twitterIntentUrl = createTwitterIntentUrl(navigatorText, miniappUrl);
    try {
      miniappSdk.actions.openUrl(twitterIntentUrl);
      console.log("success sharing to twitter");
    } catch (err) {
      console.log("error using miniappSdk.actions.openUrl", err);
      if (!window) {
        return;
      }
      window.open(twitterIntentUrl, "_blank");
      await copyToClipboard(twitterIntentUrl, setLinkCopied);
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: navigatorTitle,
          text: navigatorText,
          url: miniappUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.error("user cancelled or error", err);
        await copyToClipboard(miniappUrl, setLinkCopied);
      }
    } else {
      await copyToClipboard(miniappUrl, setLinkCopied);
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(miniappUrl, setLinkCopied);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Share options"
          className={cn(
            "w-full",
            buttonSize === "icon" && "p-2",
            buttonClassName
          )}
          size={buttonSize}
          variant={buttonVariant}
        >
          <Share2Icon className="size-4" />
          {buttonSize === "icon" ? null : buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side}>
        <DropdownMenuItem className="gap-2" onClick={handleShareToFarcaster}>
          <FarcasterIcon className="size-4" />
          Share via cast
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={handleShareToTwitter}>
          <TwitterIcon className="size-4" />
          Share via X
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={handleShareNative}>
          <Share2Icon className="size-4" />
          Share to...
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onSelect={handleCopyLink}>
          {linkCopied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
          Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
