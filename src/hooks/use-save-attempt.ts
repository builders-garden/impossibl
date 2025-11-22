import { useApiMutation } from "@/hooks/use-api-mutation";
import type {
  BackendReturnSchema,
  SaveAttemptVariables,
} from "@/types/save-attempt.type";

type ApiOkResponse<T> = { status: "ok"; data: T };
type ApiNokResponse<E = unknown> = { status: "nok"; error: E };
export type ApiResponse<T, E = unknown> = ApiOkResponse<T> | ApiNokResponse<E>;

export function useSaveAttemptMutation() {
  return useApiMutation<ApiResponse<BackendReturnSchema>, SaveAttemptVariables>(
    {
      url: (variables) => `/api/tournament/${variables.tournamentId}/attempts`,
      method: "POST",
      isProtected: true,
      body: (variables) => ({
        tournamentId: variables.tournamentId,
        hasWon: variables.hasWon,
      }),
    }
  );
}
