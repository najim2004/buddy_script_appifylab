import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** Type guard for RTK Query's FetchBaseQueryError. */
export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

/**
 * Normalizes any thrown/returned RTK Query error into a human-readable message.
 * Reads a `message` field from the API error body when available.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if (isFetchBaseQueryError(error)) {
    if ("error" in error) return error.error;

    const data = error.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? fallback;
  }

  if (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}
