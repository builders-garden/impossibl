"use client";

import { DaimoPayButton } from "@daimo/pay";
import { WorldPayButton } from "@daimo/pay/world";
import { MiniKit } from "@worldcoin/minikit-js";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { zeroAddress } from "viem";
import { base, worldchain } from "viem/chains";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useEnvironment } from "@/contexts/environment-context";
import { useSaveDepositMutation } from "@/hooks/use-save-deposit";
import {
  BASE_USDC_ADDRESS,
  IMPOSSIBLE_ADDRESS,
  WORLD_WLD_ADDRESS,
} from "@/lib/constants";
import { encodeJoinTournamentData } from "@/lib/contracts/utils";
import { env } from "@/lib/env";
import type {
  DaimoPayPaymentBouncedEvent,
  DaimoPayPaymentCompletedEvent,
} from "@/types/daimo.type";

export const DepositButton = ({ tournamentId }: { tournamentId: string }) => {
  const { address } = useAccount();
  const worldWalletAddress = MiniKit.user.walletAddress;
  const { user } = useAuth();
  const { isInWorldcoinMiniApp } = useEnvironment();

  const [message, setMessage] = useState<string | null>(null);
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { mutate: saveUserDeposit } = useSaveDepositMutation();

  const amount = "1.00"; // $1.00
  // Generate call data for joinTournament with placeholder values
  const toCallData = encodeJoinTournamentData(
    BigInt(tournamentId),
    (worldWalletAddress || address || zeroAddress) as `0x${string}`
  );

  const handlePaymentBounced = (e: DaimoPayPaymentBouncedEvent) => {
    setPaymentStarted(false);
    setPaymentCompleted(false);
    console.error("Payment bounced", e);
    setMessage("Payment bounced, please try again");
  };

  const handlePaymentCompleted = (e: DaimoPayPaymentCompletedEvent) => {
    if (!user) {
      return;
    }
    saveUserDeposit({
      tournamentId,
      txHash: e.txHash,
      amount,
    });
    setPaymentCompleted(true);
  };

  if (isInWorldcoinMiniApp) {
    return (
      <div className="flex flex-col items-end gap-2">
        {message && <p className="text-red-500">{message}</p>}
        <WorldPayButton.Custom
          appId={env.NEXT_PUBLIC_DAIMO_PAY_ID}
          metadata={{
            application: "impossibl",
            type: "daily_deposit",
            userId: user?.id || "",
            tournamentId,
            amount: Number.parseFloat(amount).toFixed(0),
            walletAddress: worldWalletAddress || address || zeroAddress,
          }}
          onPaymentBounced={handlePaymentBounced}
          onPaymentCompleted={handlePaymentCompleted}
          onPaymentStarted={() => setPaymentStarted(true)}
          toAddress={IMPOSSIBLE_ADDRESS}
          toCallData={toCallData}
          toChain={worldchain.id}
          toToken={WORLD_WLD_ADDRESS}
          toUnits={amount}
        >
          {({ show }) => (
            <DaimoPayButtonContent
              amount={amount}
              paymentCompleted={paymentCompleted}
              paymentStarted={paymentStarted}
              show={show}
            />
          )}
        </WorldPayButton.Custom>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {message && <p className="text-red-500">{message}</p>}
      <DaimoPayButton.Custom
        appId={env.NEXT_PUBLIC_DAIMO_PAY_ID}
        metadata={{
          application: "impossibl",
          type: "daily_deposit",
          userId: user?.id || "",
          tournamentId,
          amount: Number.parseFloat(amount).toFixed(0),
          walletAddress: address || zeroAddress,
        }}
        onPaymentBounced={handlePaymentBounced}
        onPaymentCompleted={handlePaymentCompleted}
        onPaymentStarted={() => setPaymentStarted(true)}
        preferredChains={[base.id]}
        preferredTokens={[{ chain: base.id, address: BASE_USDC_ADDRESS }]}
        toAddress={IMPOSSIBLE_ADDRESS}
        toCallData={toCallData}
        toChain={worldchain.id}
        toToken={WORLD_WLD_ADDRESS}
        toUnits={amount}
      >
        {({ show, hide }) => (
          <DaimoPayButtonContent
            amount={amount}
            hide={hide}
            paymentCompleted={paymentCompleted}
            paymentStarted={paymentStarted}
            show={show}
          />
        )}
      </DaimoPayButton.Custom>
    </div>
  );
};

const DaimoPayButtonContent = ({
  show,
  // hide,
  paymentStarted,
  paymentCompleted,
  amount,
}: {
  show: () => void;
  hide?: () => void;
  paymentStarted: boolean;
  paymentCompleted: boolean;
  amount: string;
}) => {
  // const handleClose = () => {
  //   if (hide) {
  //     hide();
  //   }
  // };

  return (
    <div className="flex w-full flex-col items-end gap-2">
      <Button
        className="h-auto w-full rounded-md bg-[#3bef63] px-2 py-4 hover:bg-[#3bef63]/90"
        disabled={paymentStarted || paymentCompleted}
        onClick={show}
      >
        {paymentStarted ? (
          <div className="flex items-center gap-2">
            <Loader2Icon className="h-6 w-6 animate-spin text-black" />
            <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
              PROCESSING...
            </span>
          </div>
        ) : paymentCompleted ? (
          <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
            DEPOSITED!
          </span>
        ) : (
          <span className="font-extrabold font-oxanium text-2xl text-black leading-[28px] tracking-[-0.5px]">
            DEPOSIT {Number.parseFloat(amount).toFixed(0)} WLD
          </span>
        )}
      </Button>
    </div>
  );
};
