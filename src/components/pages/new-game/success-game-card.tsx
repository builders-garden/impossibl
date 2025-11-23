import { CheckCircle, CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { ShareButton } from "@/components/shared/share-button";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "@/components/ui/copy";
import { copyToClipboard } from "@/utils";

type SuccessGameCardProps = {
  gameLink: string;
  buyInAmount: string;
  isLoading: boolean;
  timeLimit: string;
  onShare: () => void;
};

export function SuccessGameCard({
  gameLink,
  buyInAmount,
  timeLimit,
  isLoading,
  onShare,
}: SuccessGameCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isShareCopied, setIsShareCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(gameLink, setIsCopied);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border-4 border-blue-500/40 p-6">
      {/* Success Header */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center rounded-full p-1 text-blue-500">
          {isLoading ? (
            <Loader2Icon className="size-10 animate-spin" />
          ) : (
            <CheckCircle className="size-10" />
          )}
        </div>
        <h2 className="text-center font-bold font-orbitron text-4xl text-white">
          {isLoading ? "Creating Game..." : "Game Created!"}
        </h2>
        <p className="text-center font-medium font-orbitron text-white text-xl">
          Share this link with friends to join the game
        </p>
      </div>

      {/* Game Link Section */}
      <div className="flex flex-col gap-2">
        <label
          className="font-medium font-orbitron text-2xl text-blue-500"
          htmlFor="game-link"
        >
          GAME LINK
        </label>
        <div className="flex w-full items-center justify-start gap-2">
          <div className="flex grow items-center justify-start overflow-x-hidden rounded-lg border-4 border-blue-500 px-4 py-2">
            <span className="font-oxanium font-semibold text-lg text-white">
              {gameLink}
            </span>
          </div>
          <Button
            className="h-full rounded-lg bg-blue-500 p-4 hover:bg-blue-600"
            onClick={handleCopy}
            size="icon"
          >
            {isCopied ? (
              <CheckIcon className="size-6 text-black" />
            ) : (
              <CopyIcon className="size-6 text-black" />
            )}
          </Button>
        </div>
      </div>

      {/* Settings Recap */}
      <div className="flex flex-col gap-2 rounded-lg border-4 border-white/25 p-4">
        <p className="font-medium font-orbitron text-2xl text-white">
          SETTINGS
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-medium font-orbitron text-white text-xs">
            <span>BUY IN</span>
            <span>${buyInAmount}</span>
          </div>
          <div className="flex justify-between font-medium font-orbitron text-white text-xs">
            <span>TIME LIMIT</span>
            <span>{timeLimit}</span>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <ShareButton
        buttonClassName="flex w-full items-center justify-center rounded-lg bg-blue-500 py-4 hover:bg-blue-600 font-extrabold font-oxanium text-4xl text-black [&>svg]:size-8 gap-4"
        buttonSize="xl"
        buttonText="SHARE"
        buttonVariant={null}
        handleShare={onShare}
        linkCopied={isShareCopied}
        miniappUrl={gameLink}
        navigatorText="Can you beat the impossible game?"
        navigatorTitle="Join my game on Impossibl"
        setLinkCopied={setIsShareCopied}
      />
    </div>
  );
}
