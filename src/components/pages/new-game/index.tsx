"use client";

import { useState } from "react";
import { Website } from "@/components/pages/website";
import { Navbar } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";

const TIME_UNITS = ["WEEK", "DAY", "MONTH"];

export function NewGamePage() {
  const { user, isAuthenticated } = useAuth();
  const { isInBrowser } = useEnvironment();
  const [buyInAmount, setBuyInAmount] = useState("1.00");
  const [timeLimitValue, setTimeLimitValue] = useState("1");
  const [timeLimitUnit, setTimeLimitUnit] = useState("WEEK");

  if (isInBrowser) {
    return <Website page="new" />;
  }

  if (isAuthenticated && !user) {
    return <div>You are not authorized to view this page</div>;
  }

  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col items-center gap-4 overflow-y-auto font-orbitron text-white">
      <Navbar link="/" showBackButton title="Play w/ Friends" />

      <div className="flex w-full max-w-md flex-col gap-4 px-4 pb-12">
        {/* Card */}
        <div className="flex flex-col gap-6 rounded-lg border-4 border-blue-500/40 p-6">
          <h2 className="font-bold font-orbitron text-4xl text-white">
            Setup new game
          </h2>

          <div className="flex flex-col gap-4">
            {/* Buy-in Amount */}
            <div className="flex flex-col gap-2">
              <label
                className="font-medium font-orbitron text-2xl text-blue-500"
                htmlFor="buy-in-amount"
              >
                BUY-IN AMOUNT
              </label>
              <div className="flex w-full items-center justify-center gap-2 rounded-lg border-4 border-blue-500 p-4">
                <Input
                  className="relative h-full w-full rounded-lg border-4 border-blue-500 bg-transparent p-4 text-center font-extrabold font-oxanium text-3xl text-white outline-none"
                  id="buy-in-amount"
                  onChange={(e) => setBuyInAmount(e.target.value)}
                  placeholder="1.00"
                  type="number"
                  value={buyInAmount}
                />
              </div>
              <p className="font-medium font-orbitron text-white/50 text-xs">
                MINIMUM $1,00 REQUIRED
              </p>
            </div>

            {/* Time Limit */}
            <div className="flex flex-col gap-2">
              <label
                className="font-medium font-orbitron text-2xl text-blue-500"
                htmlFor="time-limit"
              >
                TIME LIMIT
              </label>
              <div className="flex gap-1">
                <Input
                  className="h-full w-full rounded-lg border-4 border-blue-500 bg-transparent p-4 text-center font-extrabold font-oxanium text-3xl text-white outline-none"
                  id="time-limit"
                  onChange={(e) => setTimeLimitValue(e.target.value)}
                  type="number"
                  value={timeLimitValue}
                />
                <Select onValueChange={setTimeLimitUnit} value={timeLimitUnit}>
                  <SelectTrigger className="h-full! w-full border-4 border-blue-500 bg-transparent p-4 font-extrabold font-oxanium text-3xl text-white">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-blue-500 bg-black">
                    {TIME_UNITS.map((unit) => (
                      <SelectItem
                        className="font-bold font-oxanium text-lg text-white focus:bg-blue-500/20 focus:text-white"
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Create Game Button */}
          <Button className="flex w-full items-center justify-center rounded-lg bg-blue-500 py-4 opacity-25 transition-opacity hover:opacity-100">
            <span className="font-extrabold font-oxanium text-4xl text-black">
              CREATE GAME
            </span>
          </Button>
        </div>

        {/* Footer Text */}
        <p className="text-center font-medium font-orbitron text-white text-xl">
          After creating, you&apos;ll get a link to share with friends
        </p>
      </div>
    </div>
  );
}
