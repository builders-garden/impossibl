import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { minikitClient } from "better-auth-minikit/client";
import { siwfClient } from "better-auth-siwf/client";
import { env } from "@/lib/env";
import type { auth } from "./auth";

const client = createAuthClient({
  baseURL: env.NEXT_PUBLIC_URL,
  plugins: [
    adminClient(),
    minikitClient(),
    siwfClient(),
    inferAdditionalFields<typeof auth>(),
    nextCookies(), // make sure this is the last plugin in the array
  ],
});

export const authClient = client as typeof client &
  typeof minikitClient &
  typeof siwfClient;
