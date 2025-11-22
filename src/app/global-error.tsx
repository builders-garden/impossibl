"use client";

import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("global error", error);
  const resetHandler = () => {
    console.log("Attempting to recover from error");
    reset();
  };

  const handleRefresh = () => {
    console.log("Refreshing the page");
    window.location.reload();
  };

  return (
    <html lang="en">
      <body
        className={"flex min-h-screen flex-col bg-black p-4 pt-0 text-white"}
      >
        <div className="flex-1 border-red-950/50 border-solid">
          <div>
            <h2 className="mb-8">{"Something went wrong!"}</h2>
            <div className="flex items-center gap-4">
              <Button
                className="w-fit rounded bg-zinc-50 px-4 py-2 font-semibold text-black transition focus-within:bg-zinc-300 hover:bg-zinc-100"
                onClick={resetHandler}
              >
                Try again
              </Button>
              <div className="flex items-center gap-1">
                <span className="block h-px w-2 bg-white/20" />
                <span className="text-sm text-white/70">or</span>
                <span className="block h-px w-2 bg-white/20" />
              </div>
              <Button
                className="w-fit rounded bg-transparent px-4 py-2 font-semibold text-white shadow-[inset_0_0_0_2px] shadow-white transition focus-within:bg-white/20 hover:bg-white/10"
                onClick={handleRefresh}
              >
                Reload the page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
