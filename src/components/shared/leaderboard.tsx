import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type LeaderboardItem = {
  rank: number;
  userId: string;
  pfpUrl?: string;
  name: string;
  attempts: number;
};

type LeaderboardProps = {
  items: LeaderboardItem[];
  you: LeaderboardItem;
  showAll?: boolean;
  onShowAll?: () => void;
};

export const Leaderboard = ({
  items,
  you,
  showAll = false,
  onShowAll,
}: LeaderboardProps) => (
  <div className="flex w-full flex-col gap-4">
    <div className="flex flex-col gap-6 rounded-lg border-4 border-white/40 p-4">
      <h2 className="font-bold font-orbitron text-2xl leading-[28px] tracking-[-0.5px]">
        Leaderboard
      </h2>

      <div className="flex w-full flex-col gap-4">
        {items.map((item) => (
          <LeaderboardItem key={item.userId} {...item} />
        ))}
      </div>

      {/* Separator Line */}
      <div className="h-px w-full bg-white/20" />

      {/* User Rank */}
      <LeaderboardItem {...you} />

      {/* View All Button */}
      {showAll ? (
        <Button
          className="h-auto w-full rounded-md border-4 border-white/25 bg-transparent px-2 py-4 hover:bg-white/5"
          onClick={onShowAll}
        >
          <span className="font-extrabold font-oxanium text-2xl text-white leading-[28px] tracking-[-0.5px]">
            VIEW ALL
          </span>
        </Button>
      ) : null}
    </div>
  </div>
);

type LeaderboardItemProps = {
  rank: number;
  name: string;
  attempts: number;
  you?: boolean;
};
export const LeaderboardItem = ({
  rank,
  name,
  attempts,
  you = false,
}: LeaderboardItemProps) => (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-lg px-2 py-1",
          you ? "bg-blue-500" : "bg-[#d9b608]"
        )}
      >
        <span className="font-black font-orbitron text-black text-xl tracking-[-0.5px]">
          #{rank}
        </span>
      </div>
      <span className="font-medium font-orbitron text-lg tracking-[-0.5px]">
        {you ? "You" : name}
      </span>
    </div>
    <span className="font-medium font-orbitron text-lg tracking-[-0.5px]">
      {attempts > 1 ? `${attempts} attempts` : `${attempts} attempt`}
    </span>
  </div>
);
