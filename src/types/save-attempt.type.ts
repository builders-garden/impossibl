import { z } from "zod";

export const saveAttemptVariablesSchema = z.object({
  tournamentId: z.string(),
  hasWon: z.boolean(),
});
export type SaveAttemptVariables = z.infer<typeof saveAttemptVariablesSchema>;

export const backendReturnSchemaSuccessfull = z.object({
  status: z.literal("ok"),
  data: z.object({
    attempts: z.number(),
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
