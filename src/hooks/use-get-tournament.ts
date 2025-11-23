import type { User, UserPrize } from "@/lib/database/db.schema";
import { useApiQuery } from "./use-api-query";

type ApiOkResponse<T> = { status: "ok"; data: T };
type ApiNokResponse<E = unknown> = { status: "nok"; error: E };
export type ApiResponse<T, E = unknown> = ApiOkResponse<T> | ApiNokResponse<E>;

export function useGetUserPrizesByTournament({
  tournamentId,
}: {
  tournamentId: string;
}) {
  return useApiQuery<ApiResponse<(UserPrize & { user: User })[]>, void>({
    url: `/api/tournament/${tournamentId}`,
    method: "GET",
    isProtected: true,
    queryKey: ["userPrizes", tournamentId],
  });
}
