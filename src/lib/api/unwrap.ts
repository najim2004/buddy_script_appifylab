import type { ApiResponse } from "@/types/api.types";

export function unwrapData<T>(response: ApiResponse<T>): T {
  return response.data;
}

export type CursorMeta = {
  next_cursor: string | null;
  has_next_page: boolean;
};

export type ApiListResponse<T> = ApiResponse<T> & {
  meta?: CursorMeta;
};

export function unwrapList<T>(response: ApiListResponse<T[]>): {
  data: T[];
  meta?: CursorMeta;
} {
  return { data: response.data ?? [], meta: response.meta };
}
