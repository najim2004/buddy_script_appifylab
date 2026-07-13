import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

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
