import { useApiMutation } from "@/hooks/use-api-mutation";
import type { CreateGroupTournamentReturnSchema } from "@/types/create-group-tournament.type";

type ApiOkResponse<T> = { status: "ok"; data: T };
type ApiNokResponse<E = unknown> = { status: "nok"; error: E };
export type ApiResponse<T, E = unknown> = ApiOkResponse<T> | ApiNokResponse<E>;

export function useCreateGroupTournamentMutation({
  isInWorldcoin,
}: {
  isInWorldcoin: boolean;
}) {
  return useApiMutation<CreateGroupTournamentReturnSchema, void>({
    url: "/api/create-group-tournament",
    method: "POST",
    isProtected: true,
    body: () => ({
      isInWorldcoin,
    }),
  });
}
