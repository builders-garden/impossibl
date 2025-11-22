import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIME_UNITS = ["WEEK", "DAY", "MONTH"];

type TimeLimitFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
};

export function TimeLimitField({
  value,
  onValueChange,
  unit,
  onUnitChange,
}: TimeLimitFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="font-medium font-orbitron text-2xl text-blue-500"
        htmlFor="time-limit"
      >
        TIME LIMIT
      </label>
      <div className="flex gap-2">
        <div className="flex basis-1/3 items-center justify-center rounded-lg border-4 border-blue-500 p-4">
          <Input
            className="h-auto w-full border-none bg-transparent p-0 text-center font-extrabold font-oxanium text-3xl text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            id="time-limit"
            onChange={(e) => onValueChange(e.target.value)}
            type="number"
            value={value}
          />
        </div>
        <Select onValueChange={onUnitChange} value={unit}>
          <SelectTrigger className="h-full! w-full basis-2/3 border-4 border-blue-500 bg-transparent p-4 font-extrabold font-oxanium text-3xl text-white focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
            <div className="flex w-full items-center justify-between gap-2">
              <SelectValue placeholder="Unit" />
              <ChevronDown className="h-6 w-6 opacity-50" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-2 border-blue-500 bg-black">
            {TIME_UNITS.map((u) => (
              <SelectItem
                className="font-bold font-oxanium text-lg text-white focus:bg-blue-500/20 focus:text-white"
                key={u}
                value={u}
              >
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
