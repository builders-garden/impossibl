import { eq } from "drizzle-orm";
import { db } from "@/lib/database";
import type { CreateUser, UpdateUser } from "@/lib/database/db.schema";
import { user } from "@/lib/database/db.schema";
import { fetchUserFromNeynarByFid } from "@/lib/neynar";
import type { User } from "@/types/user.type";
import { formatAvatarSrc } from "@/utils";
import { createAccount } from "./account.query";
import { createFarcasterUser } from "./farcaster.query";

/**
 *
 * @param userId - The database ID of the user
 * @returns
 */
export const getUserFromId = async (userId: string): Promise<User | null> => {
  const row = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      farcaster: true,
    },
  });
  return row ?? null;
};

/**
 * Get a user from their Farcaster fid
 * @param fid - The Farcaster fid of the user
 * @returns The user or null if the user is not found
 */
export async function getUserFromFid(fid: number): Promise<User | null> {
  if (fid < 0) {
    return null;
  }

  const row = await db.query.user.findFirst({
    where: eq(user.farcasterFid, fid),
    with: {
      farcaster: true,
    },
  });

  return row ?? null;
}

/**
 * Create a user in the database
 * @param newUserData - The data for the new user
 * @returns The new user
 */
export const createUser = async (newUserData: CreateUser): Promise<User> => {
  const [newUser] = await db.insert(user).values(newUserData).returning();
  return newUser;
};

/**
 * Create a user from their Farcaster fid
 * @param fid - The Farcaster fid of the user
 * @returns The user
 */
export async function createUserFromFid(fid: number): Promise<User> {
  const neynarUser = await fetchUserFromNeynarByFid(fid);
  if (!neynarUser) {
    throw new Error("Failed to fetch user from Neynar");
  }

  // 1. create the user in the db
  const newUser = await createUser({
    name: neynarUser.username ?? fid.toString(),
    image: neynarUser.pfp_url ? formatAvatarSrc(neynarUser.pfp_url) : undefined,
    email: `${fid}@farcaster.emails`,
    role: "user",
    minikitAddress: "",
  });

  // 2. create the farcaster user in the db
  // 3. create the account in the db
  const [newFarcasterUser] = await Promise.all([
    createFarcasterUser({
      userId: newUser.id,
      fid,
      username: neynarUser.username ?? fid.toString(),
      displayName: neynarUser.display_name,
      avatarUrl: neynarUser.pfp_url
        ? formatAvatarSrc(neynarUser.pfp_url)
        : undefined,
      notificationDetails: [],
    }),
    createAccount({
      userId: newUser.id,
      providerId: "farcaster",
      accountId: `farcaster:${fid}`,
      minikitAddress: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ]);

  return {
    ...newUser,
    farcaster: newFarcasterUser,
  };
}

/**
 * Get a user from their Farcaster fid or create them if they don't exist
 * @param fid - The Farcaster fid of the user
 * @returns The user id in the database
 */
export async function getOrCreateUserFromFid(fid: number): Promise<User> {
  const userFromDb = await getUserFromFid(fid);
  if (userFromDb) {
    return userFromDb;
  }
  // Creation by FID is handled by Better Auth's Farcaster plugin. We surface a clear error here.
  const newUser = await createUserFromFid(fid);
  return newUser;
}

/**
 * Update a user in the database
 * @param userId - The database ID of the user
 * @param newUser - The new user data
 * @returns The updated user
 */
export const updateUser = async (userId: string, newUser: UpdateUser) =>
  await db.update(user).set(newUser).where(eq(user.id, userId));
