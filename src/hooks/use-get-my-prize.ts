import type { UserPrize } from "@/lib/database/db.schema";
import { useApiQuery } from "./use-api-query";

type ApiOkResponse<T> = { status: "ok"; data: T };
type ApiNokResponse<E = unknown> = { status: "nok"; error: E };
export type ApiResponse<T, E = unknown> = ApiOkResponse<T> | ApiNokResponse<E>;

export function useGetMyPrize({ tournamentId }: { tournamentId: string }) {
  return useApiQuery<ApiResponse<UserPrize>, void>({
    url: `/api/tournament/${tournamentId}/my`,
    method: "GET",
    isProtected: true,
    queryKey: ["my-userPrize", tournamentId],
  });
}
