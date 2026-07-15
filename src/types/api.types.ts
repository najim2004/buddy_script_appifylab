export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
}

export interface CursorMeta {
  next_cursor: string | null;
  has_next_page: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
