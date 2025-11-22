import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type CreateGameButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export function CreateGameButton({ onClick, disabled }: CreateGameButtonProps) {
  return (
    <Button
      className={cn(
        "flex w-full items-center justify-center rounded-lg bg-blue-500 py-4 transition-opacity hover:bg-blue-600",
        disabled
          ? "cursor-not-allowed opacity-25 hover:opacity-25"
          : "opacity-100"
      )}
      disabled={disabled}
      onClick={onClick}
      size="xl"
    >
      <span className="font-extrabold font-oxanium text-4xl text-black">
        CREATE GAME
      </span>
    </Button>
  );
}
