import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { WorldcoinIcon } from "@/components/shared/icons/worldcoin-icon";
import { env } from "@/lib/env";
import { cn } from "@/utils";

export const Website = ({ page }: { page?: string }) => {
  // const farcasterUrl = `https://farcaster.xyz/?launchFrameUrl=${encodeURIComponent(
  //   env.NEXT_PUBLIC_URL
  // )}${page ? `/${encodeURIComponent(page)}` : ""}`;

  // const baseUrl = `cbwallet://miniapp?url=${encodeURIComponent(
  //   env.NEXT_PUBLIC_URL
  // )}${page ? `/${encodeURIComponent(page)}` : ""}`;

  const worldcoinUrl = `https://worldcoin.org/mini-app?app_id=${env.NEXT_PUBLIC_WORLD_APP_ID}${page ? `&path=/${encodeURIComponent(page)}` : ""}`;

  return (
    <main className="w-full overflow-y-auto p-4 sm:p-0">
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:gap-24 sm:py-12">
        {/* Content Section */}
        <div className="flex flex-col gap-4 sm:gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row items-center gap-6">
              <Image
                alt={`${env.NEXT_PUBLIC_APPLICATION_NAME} Logo`}
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                height={96}
                src="/images/splash.png"
                width={96}
              />
              <div className="flex flex-col">
                <h1 className="font-normal text-lg sm:text-2xl">
                  {env.NEXT_PUBLIC_APPLICATION_NAME}
                </h1>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative w-full rounded-xl p-5",
              "bg-linear-to-br from-black/5 to-transparent dark:from-white/8 dark:to-transparent",
              "backdrop-blur-md backdrop-saturate-150",
              "border border-black/5 dark:border-white/8",
              "text-black/90 dark:text-white",
              "shadow-xs",
              "translate-z-0 will-change-transform",
              "before:pointer-events-none before:absolute before:inset-0 before:bg-linear-to-br before:from-black/2 before:to-black/1 before:opacity-0 before:transition-opacity dark:before:from-white/3 dark:before:to-white/1",
              "hover:before:opacity-100"
            )}
          >
            <h1 className="font-semibold text-lg sm:text-2xl">How to use</h1>
            <ul className="list-inside text-black/80 text-xs sm:text-lg dark:text-white">
              <li>1. Open the app on Worldcoin</li>
              <li>2. Scan the QR code to open the app</li>
              <li>3. Enjoy :)</li>
            </ul>
          </div>

          <div className="flex flex-row gap-0 sm:gap-4">
            <div className="flex flex-col gap-0 sm:gap-4">
              <div className="hidden w-fit rounded-xl border-2 border-black/20 bg-white p-2 backdrop-blur-sm sm:block">
                <QRCodeSVG className="w-fit rounded-sm" value={worldcoinUrl} />
              </div>
            </div>

            <div className="flex w-full flex-col gap-4">
              {/* Open on Worldcoin */}
              <Link
                className="cursor-pointer rounded-lg border border-[#CECECE] bg-white text-black shadow-xl hover:bg-white/80 dark:text-white"
                href={new URL(worldcoinUrl)}
                target="_blank"
              >
                <WorldcoinIcon className="h-[148px] w-full" />
              </Link>

              {/* Open on Farcaster 
              <Button
                asChild
                className="bg-[#8A63D2] hover:bg-[#8A63D2]/80"
                variant="default"
              >
                <Link href={new URL(farcasterUrl)} target="_blank">
                  <FarcasterIcon className="size-6" />
                  <span className="font-medium text-xl">Farcaster</span>
                </Link>
              </Button>
              */}

              {/* Open on Base 
              <Button
                asChild
                className="w-full bg-[#00F] hover:bg-[#00F]/80"
                variant="default"
              >
                <Link
                  className="w-full"
                  href={new URL(baseUrl)}
                  target="_blank"
                >
                  <BaseIcon className="h-16 w-16 fill-white" />
                  <span className="font-medium text-xl">Base</span>
                </Link>
              </Button>
              */}
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
            <p className="text-black text-xs sm:text-base dark:text-white">
              Built with ❤️ by{" "}
              <Link
                className="font-bold text-black dark:text-white"
                href={new URL("https://builders.garden")}
                target="_blank"
              >
                Builders Garden
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
