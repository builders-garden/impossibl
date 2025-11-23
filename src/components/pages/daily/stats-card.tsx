import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils";
import { DepositButton } from "./deposit-button";

export const StatsCard = ({
  prizePool,
  endAt,
}: {
  prizePool: number;
  endAt: Date;
}) => (
  <div className="flex flex-col gap-4 rounded-lg border-4 border-[#3bef63]/40 bg-[#3bef63]/10 p-4">
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
        <span className="font-extrabold">257</span>
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
    <DepositButton />

    {/* Play Button (Disabled/Opacity) */}
    <Button
      asChild
      className="h-auto w-full rounded-md bg-[#3bef63] px-2 py-4 hover:bg-[#3bef63]/30 disabled:bg-[#3bef63]/25"
    >
      <Link href="/daily/1">
        <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
          PLAY
        </span>
      </Link>
    </Button>

    <p className="text-gray-500 text-sm">
      Pay $1 daily to enter the daily challenge.
    </p>
  </div>
);
