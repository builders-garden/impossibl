import { z } from "zod";
import type { UserPrize } from "@/lib/database/db.schema";

export const saveDepositVariablesSchema = z.object({
  tournamentId: z.string(),
  txHash: z.string(),
  amount: z.string(),
});
export type SaveDepositVariables = z.infer<typeof saveDepositVariablesSchema>;

export const backendReturnSchemaSuccessfull = z.object({
  status: z.literal("ok"),
  data: z.object({
    userPrize: z.custom<UserPrize>(),
  }),
});
export const backendReturnSchemaFailed = z.object({
  status: z.literal("nok"),
  error: z.string(),
});
export const backendReturnSchema = z.union([
  backendReturnSchemaSuccessfull,
  backendReturnSchemaFailed,
]);

export type BackendReturnSchema = z.infer<typeof backendReturnSchema>;
