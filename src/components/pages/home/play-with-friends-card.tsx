import Link from "next/link";
import { Button } from "@/components/ui/button";

export const PlayWithFriendsCard = () => (
  <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border-4 border-white/25 p-6">
    <h2 className="text-center font-extrabold text-2xl leading-[28px] tracking-[-0.5px]">
      Play w/ Friends
    </h2>
    <p className="text-center font-normal text-lg leading-[28px] tracking-[-0.5px]">
      Create custom room and challenge your friends
    </p>

    <Button
      asChild
      className="h-auto w-full rounded-md bg-white px-2 py-4 hover:bg-white/90"
    >
      <Link href="/new">
        <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
          NEW GAME
        </span>
      </Link>
    </Button>
  </div>
);
