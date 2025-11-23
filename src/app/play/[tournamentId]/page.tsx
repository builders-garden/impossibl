import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TournamentPage } from "@/components/pages/tournament";
import { OG_IMAGE_SIZE } from "@/lib/constants";
import { getTournamentById } from "@/lib/database/queries/tournament.query";
import { env } from "@/lib/env";

const appUrl = env.NEXT_PUBLIC_URL;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ tournamentId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { tournamentId } = await params;
  const _searchParams = await searchParams;
  const searchParamsString = Object.entries(_searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const ogTitle = env.NEXT_PUBLIC_APPLICATION_NAME;
  const ogDescription = env.NEXT_PUBLIC_APPLICATION_DESCRIPTION;

  const ogImageUrl = tournamentId
    ? `${appUrl}/api/og/tournament/${tournamentId}`
    : `${appUrl}/images/feed.png`;
  const farcasterImageUrl = tournamentId
    ? `${appUrl}/api/og/tournament/${tournamentId}?ar=3x2`
    : `${appUrl}/images/feed-3x2.png`;

  const miniapp = {
    version: "next",
    imageUrl: farcasterImageUrl,
    button: {
      title: tournamentId
        ? "Play Game"
        : `Launch ${env.NEXT_PUBLIC_APPLICATION_NAME}`,
      action: {
        type: "launch_miniapp",
        name: env.NEXT_PUBLIC_APPLICATION_NAME,
        url: `${appUrl}/play/${tournamentId}${
          searchParamsString ? `?${searchParamsString}` : ""
        }`,
        splashImageUrl: `${appUrl}/images/splash.png`,
        splashBackgroundColor: "#ffffff",
      },
    },
  };

  return {
    title: ogTitle,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      siteId: "1727435024931094528",
      creator: "@builders_garden",
      creatorId: "1727435024931094528",
      images: [ogImageUrl],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniapp),
    },
  };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const tournament = await getTournamentById(tournamentId);
  if (!tournament) {
    redirect("/");
  }

  return <TournamentPage tournament={tournament} />;
}
