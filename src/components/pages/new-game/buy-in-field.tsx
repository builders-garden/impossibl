import { Input } from "@/components/ui/input";

type BuyInFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BuyInField({ value, onChange }: BuyInFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="font-medium font-orbitron text-2xl text-blue-500"
        htmlFor="buy-in-amount"
      >
        BUY-IN AMOUNT
      </label>
      <div className="flex w-full items-center gap-2 rounded-lg border-4 border-blue-500 p-4">
        <span className="font-extrabold font-oxanium text-3xl text-blue-500">
          $
        </span>
        <Input
          className="h-full w-full border-none bg-transparent p-0 text-center font-extrabold font-oxanium text-3xl text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0"
          id="buy-in-amount"
          onChange={(e) => onChange(e.target.value)}
          placeholder="1.00"
          type="number"
          value={value}
        />
      </div>
      <p className="font-medium font-orbitron text-white/50 text-xs">
        MINIMUM $1,00 REQUIRED
      </p>
    </div>
  );
}
