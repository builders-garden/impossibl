import { Button } from "@/components/ui/button";

export const GameOptions = () => (
  <div className="flex w-full gap-4">
    <Button className="h-auto flex-1 rounded-md border-4 border-white/25 bg-transparent px-2 py-4 hover:bg-white/10">
      <span className="font-extrabold font-oxanium text-2xl text-white leading-[28px] tracking-[-0.5px]">
        STATS
      </span>
    </Button>
    <Button className="h-auto flex-1 rounded-md border-4 border-white/25 bg-transparent px-2 py-4 hover:bg-white/10">
      <span className="font-extrabold font-oxanium text-2xl text-white leading-[28px] tracking-[-0.5px]">
        OPTIONS
      </span>
    </Button>
  </div>
);
