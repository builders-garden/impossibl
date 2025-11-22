"use client";

import { useRouter } from "next/navigation";
import type * as React from "react";
import { Button } from "@/components/ui/button";

export default function NotFound(): React.JSX.Element {
  const router = useRouter();

  const handleGoBack = (): void => {
    router.back();
  };
  const handleBackToHome = (): void => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="font-semibold text-[10rem] leading-none">404</span>
        <h2 className="my-2 font-bold font-heading text-2xl">
          Something&apos;s missing
        </h2>
        <p>
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <Button
            onClick={handleGoBack}
            size="lg"
            type="button"
            variant="default"
          >
            Go back
          </Button>
          <Button
            onClick={handleBackToHome}
            size="lg"
            type="button"
            variant="ghost"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
