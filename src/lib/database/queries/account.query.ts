import { db } from "@/lib/database";
import type { Account, CreateAccount } from "@/lib/database/db.schema";
import { account } from "@/lib/database/db.schema";
/**
 *
 * Create a new account in the database
 * @param newAccountData - The data for the new account
 * @returns The new account
 */
export const createAccount = async (
  newAccountData: CreateAccount
): Promise<Account> => {
  const [newAccount] = await db
    .insert(account)
    .values(newAccountData)
    .returning();
  return newAccount;
};
