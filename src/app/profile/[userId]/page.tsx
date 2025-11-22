import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfilePage } from "@/components/pages/profile";
import { OG_IMAGE_SIZE } from "@/lib/constants";
import { getUserFromId } from "@/lib/database/queries/user.query";
import { env } from "@/lib/env";

const appUrl = env.NEXT_PUBLIC_URL;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const _searchParams = await searchParams;
  const searchParamsString = Object.entries(_searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const ogTitle = env.NEXT_PUBLIC_APPLICATION_NAME;
  const ogDescription = env.NEXT_PUBLIC_APPLICATION_DESCRIPTION;

  const ogImageUrl = userId
    ? `${appUrl}/api/og/profile/${userId}`
    : `${appUrl}/images/feed.png`;
  const farcasterImageUrl = userId
    ? `${appUrl}/api/og/profile/${userId}?ar=3x2`
    : `${appUrl}/images/feed.png`;

  const miniapp = {
    version: "next",
    imageUrl: farcasterImageUrl,
    button: {
      title: userId
        ? "See Profile"
        : `Launch ${env.NEXT_PUBLIC_APPLICATION_NAME}`,
      action: {
        type: "launch_miniapp",
        name: env.NEXT_PUBLIC_APPLICATION_NAME,
        url: `${appUrl}/profile/${userId}${
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
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserFromId(userId);
  if (!user) {
    redirect("/");
  }

  return <ProfilePage user={user} />;
}
