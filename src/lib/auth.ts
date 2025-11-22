/** biome-ignore-all lint/performance/noNamespaceImport: drizzle import schema */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { generateRandomString } from "better-auth/crypto";
import { nextCookies } from "better-auth/next-js";
import { admin, openAPI } from "better-auth/plugins";
import type { BetterAuthOptions } from "better-auth/types";
import { minikit } from "better-auth-minikit";
import { siwf } from "better-auth-siwf";
import { db } from "@/lib/database";
import * as schema from "@/lib/database/db.schema";
import { env } from "@/lib/env";
import { ensLookup } from "./ens";
import { verifySIWEMessage } from "./viem";

export const auth = betterAuth<BetterAuthOptions>({
  baseURL: env.NEXT_PUBLIC_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  trustedOrigins: [env.NEXT_PUBLIC_URL],
  emailAndPassword: {
    enabled: false,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration 5 minutes [seconds]
    },
  },
  logger: console,
  plugins: [
    openAPI(),
    admin(),
    siwf({
      hostname: new URL(env.NEXT_PUBLIC_URL).hostname,
      allowUserToLink: false,
    }),
    minikit({
      domain: new URL(env.NEXT_PUBLIC_URL).hostname,
      emailDomainName: new URL(env.NEXT_PUBLIC_URL).hostname,
      anonymous: false,
      getNonce: async () => await generateRandomString(32),
      verifyMessage: async ({ message, signature, address }) =>
        await verifySIWEMessage(message, signature, address),
      ensLookup: async ({ walletAddress }) => await ensLookup(walletAddress),
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
