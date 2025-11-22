import type {
  Farcaster as DbFarcaster,
  User as DbUser,
} from "@/lib/database/db.schema";

export type User = DbUser & {
  farcaster?: DbFarcaster | null;
};

export type FarcasterUser = DbFarcaster & {
  user: DbUser;
};
