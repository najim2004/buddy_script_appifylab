import type { ApiResponse } from "@/types/api.types";

/** Unwrap backend `{ success, data }` envelope only. */
export function unwrapData<T>(response: ApiResponse<T>): T {
  return response.data;
}

export type CursorMeta = {
  next_cursor: string | null;
  has_next_page: boolean;
};

/** List envelope after dropping `success` — keeps backend `data` + `meta` keys. */
export type ApiListResponse<T> = ApiResponse<T> & {
  meta?: CursorMeta;
};

export function unwrapList<T>(response: ApiListResponse<T[]>): {
  data: T[];
  meta?: CursorMeta;
} {
  return { data: response.data ?? [], meta: response.meta };
}
