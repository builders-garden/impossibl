import { BuyInField } from "./buy-in-field";
import { CreateGameButton } from "./create-game-button";
import { TimeLimitField } from "./time-limit-field";

type SetupGameCardProps = {
  buyInAmount: string;
  onBuyInAmountChange: (value: string) => void;
  timeLimitValue: string;
  onTimeLimitValueChange: (value: string) => void;
  timeLimitUnit: string;
  onTimeLimitUnitChange: (value: string) => void;
  onSubmit?: () => void;
  isValid?: boolean;
};

export function SetupGameCard({
  buyInAmount,
  onBuyInAmountChange,
  timeLimitValue,
  onTimeLimitValueChange,
  timeLimitUnit,
  onTimeLimitUnitChange,
  onSubmit,
  isValid = true,
}: SetupGameCardProps) {
  return (
    <div className="flex flex-col gap-6 rounded-lg border-4 border-blue-500/40 p-6">
      <h2 className="font-bold font-orbitron text-4xl text-white">
        Setup new game
      </h2>

      <div className="flex flex-col gap-4">
        <BuyInField onChange={onBuyInAmountChange} value={buyInAmount} />
        <TimeLimitField
          onUnitChange={onTimeLimitUnitChange}
          onValueChange={onTimeLimitValueChange}
          unit={timeLimitUnit}
          value={timeLimitValue}
        />
      </div>

      <CreateGameButton disabled={!isValid} onClick={onSubmit} />
    </div>
  );
}
