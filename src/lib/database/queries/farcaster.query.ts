import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/database";
import type { CreateFarcaster, Farcaster } from "@/lib/database/db.schema";
import { farcaster } from "@/lib/database/db.schema";
import type { FarcasterNotificationDetails } from "@/types/farcaster.type";

/**
 * Create a new farcaster user in the database
 * @param newFarcasterUserData - The data for the new farcaster user
 * @returns The new farcaster user
 */
export const createFarcasterUser = async (
  newFarcasterUserData: CreateFarcaster
): Promise<Farcaster> => {
  const [newFarcasterUser] = await db
    .insert(farcaster)
    .values(newFarcasterUserData)
    .returning();
  return newFarcasterUser;
};

/**
 * Get a farcaster user from their user ID
 * @param userId - The database ID of the user
 * @returns The user item
 */
export const getFarcasterUserFromUserId = async (
  userId: string
): Promise<Farcaster | null> => {
  if (!userId) {
    return null;
  }

  const row = await db.query.farcaster.findFirst({
    where: eq(farcaster.userId, userId),
  });

  return row ?? null;
};

/**
 * Get a farcaster user from their Farcaster FID
 * @param fid - The Farcaster FID of the user
 * @returns The farcaster user or null if the user is not found
 */
export const getFarcasterUserFromFid = async (
  fid: number
): Promise<Farcaster | null> => {
  if (fid < 0) {
    return null;
  }

  const row = await db.query.farcaster.findFirst({
    where: eq(farcaster.fid, fid),
  });
  return row ?? null;
};

/**
 * Get the notification details for a user
 * @param fid - The Farcaster FID of the user
 * @returns The notification details
 */
export const getUserNotificationDetails = async (
  fid: number
): Promise<FarcasterNotificationDetails[]> => {
  const row = await db.query.farcaster.findFirst({
    where: eq(farcaster.fid, fid),
    columns: {
      notificationDetails: true,
    },
  });
  if (!row) {
    return [];
  }

  try {
    return row.notificationDetails ?? [];
  } catch (_error) {
    return [];
  }
};

/**
 * Set the notification details for a user
 * @param fid - The Farcaster FID of the user
 * @param notificationDetails - The notification details to set
 * @returns The updated user
 */
export const setUserNotificationDetails = async ({
  fid,
  notificationDetails,
}: {
  fid: number;
  notificationDetails: FarcasterNotificationDetails;
}) => {
  const existingNotificationDetails = await getUserNotificationDetails(fid);
  const newNotificationDetails = [
    ...(existingNotificationDetails ?? []),
    notificationDetails,
  ];

  return await db
    .update(farcaster)
    .set({
      notificationDetails: newNotificationDetails,
    })
    .where(eq(farcaster.fid, fid));
};

/**
 * Delete the notification details for a user
 * @param fid - The Farcaster FID of the user
 * @returns The updated user
 */
export const deleteUserNotificationDetails = async ({
  appFid,
  fid,
}: {
  appFid: number;
  fid: number;
}) => {
  const notificationDetails = await getUserNotificationDetails(fid);
  if (!notificationDetails) {
    return null;
  }

  // filter the notification details for the appFid that has been removed
  const newNotificationDetails = notificationDetails.filter(
    (detail) => detail.appFid !== appFid
  );

  return await db
    .update(farcaster)
    .set({
      notificationDetails: newNotificationDetails,
    })
    .where(eq(farcaster.fid, fid));
};

/**
 * Get all users with notification details
 * @returns All users with notification details
 */
export const getAllUsersNotificationDetails = async (): Promise<
  | {
      farcasterFid: number;
      farcasterNotificationDetails: FarcasterNotificationDetails[];
    }[]
  | null
> => {
  const farcasterRows = await db.query.farcaster.findMany({
    where: and(
      isNotNull(farcaster.notificationDetails),
      isNotNull(farcaster.fid)
    ),
    columns: {
      fid: true,
      notificationDetails: true,
    },
  });
  if (!farcasterRows) {
    return null;
  }
  const results = farcasterRows
    .filter(
      (row) =>
        row.notificationDetails != null && row.notificationDetails.length > 0
    )
    .map((row) => ({
      farcasterFid: row.fid,
      farcasterNotificationDetails: row.notificationDetails ?? [],
    }));
  return results;
};
