import { useApiMutation } from "@/hooks/use-api-mutation";
import type {
  BackendReturnSchema,
  SaveDepositVariables,
} from "@/types/save-deposit.type";

type ApiOkResponse<T> = { status: "ok"; data: T };
type ApiNokResponse<E = unknown> = { status: "nok"; error: E };
export type ApiResponse<T, E = unknown> = ApiOkResponse<T> | ApiNokResponse<E>;

export function useSaveDepositMutation() {
  return useApiMutation<ApiResponse<BackendReturnSchema>, SaveDepositVariables>(
    {
      url: (variables) => `/api/tournament/${variables.tournamentId}/deposit`,
      method: "POST",
      isProtected: true,
      body: (variables) => ({
        tournamentId: variables.tournamentId,
        txHash: variables.txHash,
        amount: variables.amount,
      }),
    }
  );
}
