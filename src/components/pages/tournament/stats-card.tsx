import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatTime } from "@/utils";
import { DepositButton } from "./deposit-button";

export const StatsCard = ({
  prizePool,
  endAt,
  hasDeposited,
  hasWinner,
  isLoading,
  tournamentId,
  className,
  onPlay,
  userPrizesLength,
}: {
  prizePool: number;
  endAt: Date;
  hasDeposited: boolean;
  hasWinner: boolean;
  isLoading: boolean;
  tournamentId: string;
  className?: string;
  onPlay: () => void;
  userPrizesLength: number;
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border-4 border-[#3bef63]/40 bg-[#3bef63]/10 p-4",
        className
      )}
    >
      <div className="flex w-full flex-col gap-2">
        {/* Entry Fee */}
        <div className="flex items-start justify-between font-medium font-orbitron leading-[28px] tracking-[-0.5px]">
          <div className="flex items-end gap-2">
            <span className="text-xl">Entry Fee</span>
            <span className="mb-1 text-sm">(once per day)</span>
          </div>
          <span className="font-extrabold text-xl">$1,00</span>
        </div>

        {/* Players Joined */}
        <div className="flex items-center justify-between font-medium font-orbitron text-xl leading-[28px] tracking-[-0.5px]">
          <span>Players Joined</span>
          <span className="font-extrabold">{userPrizesLength}</span>
        </div>

        {/* Prize Pool */}
        <div className="flex items-center justify-between font-extrabold font-orbitron text-[#41cb6e] text-xl leading-[28px] tracking-[-0.5px]">
          <span>Prize Pool</span>
          <span className="">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(prizePool)}
          </span>
        </div>

        {/* Time Left */}
        <div className="flex items-center justify-between font-medium font-orbitron text-[#d9b608] text-xl leading-[28px] tracking-[-0.5px]">
          <span>Time Left</span>
          <span className="font-bold">{formatTime(endAt)}</span>
        </div>
      </div>

      {/* Deposit Button */}
      {hasDeposited ? null : <DepositButton tournamentId={tournamentId} />}

      {/* Play Button (Disabled/Opacity) */}
      <div className="flex w-full flex-col items-end justify-end gap-2">
        <div className="w-full">
          <Button
            className="h-auto w-full rounded-md bg-[#3bef63] px-2 py-4 hover:bg-[#3bef63]/30 disabled:bg-[#3bef63]/25"
            disabled={!hasDeposited || isLoading || hasWinner}
            onClick={hasWinner ? undefined : onPlay}
          >
            <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
              {hasWinner ? "ENDED" : "PLAY"}
            </span>
          </Button>
        </div>
        <Button
          className="size-10 rounded-md bg-[#3bef63] px-2 py-4 hover:bg-[#3bef63]/30 disabled:bg-[#3bef63]/25"
          onClick={handleRefresh}
          size="icon"
          variant="outline"
        >
          <RefreshCwIcon className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};
