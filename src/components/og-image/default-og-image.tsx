/** biome-ignore-all lint/performance/noImgElement: fix next */
import { env } from "@/lib/env";

export const DefaultOGImage = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <img
    alt="Default for Builders Garden"
    height={`${height}px`}
    src={`${env.NEXT_PUBLIC_URL}/images/feed.png`}
    width={`${width}px`}
  />
);
