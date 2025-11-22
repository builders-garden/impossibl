import type { Metadata } from "next";
import { NewGamePage } from "@/components/pages/new-game";
import { OG_IMAGE_SIZE } from "@/lib/constants";
import { env } from "@/lib/env";

const appUrl = env.NEXT_PUBLIC_URL;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const _searchParams = await searchParams;
  const searchParamsString = Object.entries(_searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const ogTitle = env.NEXT_PUBLIC_APPLICATION_NAME;
  const ogDescription = env.NEXT_PUBLIC_APPLICATION_DESCRIPTION;

  const imageUrl = `${appUrl}/images/feed.png`;

  const miniapp = {
    version: "next",
    imageUrl,
    button: {
      title: `Launch ${env.NEXT_PUBLIC_APPLICATION_NAME}`,
      action: {
        type: "launch_miniapp",
        name: env.NEXT_PUBLIC_APPLICATION_NAME,
        url: `${appUrl}/daily${
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
          url: imageUrl,
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
      images: [imageUrl],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniapp),
    },
  };
}

export default function NewGame() {
  return <NewGamePage />;
}
