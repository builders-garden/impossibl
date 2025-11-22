import Link from "next/link";
import { Button } from "@/components/ui/button";

export const DailyChallengeCard = () => (
  <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border-4 border-[#3bef63]/40 bg-[#3bef63]/10 p-6">
    <h2 className="text-center font-extrabold text-2xl leading-[28px] tracking-[-0.5px]">
      Daily Challenge
    </h2>
    <p className="text-center font-normal text-xl leading-[28px] tracking-[-0.5px]">
      Compete in today's featured level and win rewards
    </p>

    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between font-medium text-xl leading-[28px] tracking-[-0.5px]">
        <span>Prize Pool</span>
        <span className="text-[#41cb6e]">$257,00</span>
      </div>
      <div className="flex items-center justify-between font-medium text-xl leading-[28px] tracking-[-0.5px]">
        <span>Time Left</span>
        <span className="text-[#d9b608]">14H 13M 24S</span>
      </div>
    </div>

    <Button
      asChild
      className="h-auto w-full rounded-md bg-[#3bef63] px-2 py-4 hover:bg-[#3bef63]/90"
    >
      <Link className="w-full" href="/daily">
        <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
          PLAY NOW
        </span>
      </Link>
    </Button>

    <Button className="h-auto w-full rounded-md border-2 border-[#3bef63] bg-black px-2 py-4 hover:bg-[#3bef63]/10">
      <span className="font-extrabold font-oxanium text-2xl text-[#3bef63] leading-[28px] tracking-[-0.5px]">
        LEADERBOARD
      </span>
    </Button>
  </div>
);
