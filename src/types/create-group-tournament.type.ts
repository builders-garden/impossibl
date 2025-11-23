import { z } from "zod";

export const backendReturnSchemaSuccessfull = z.object({
  status: z.literal("ok"),
  data: z.object({
    txHash: z.string(),
    tournamentId: z.string(),
  }),
});
export const backendReturnSchemaFailed = z.object({
  status: z.literal("nok"),
  error: z.string(),
  message: z.string(),
});
export const backendReturnSchema = z.discriminatedUnion("status", [
  backendReturnSchemaSuccessfull,
  backendReturnSchemaFailed,
]);

export type CreateGroupTournamentReturnSchema = z.infer<
  typeof backendReturnSchema
>;
