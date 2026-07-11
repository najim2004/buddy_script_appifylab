"use client";

import { useAppSelector } from "@/store/hooks";

/** Convenient typed access to the current auth state. */
export function useAuth() {
  const { user, accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    isAdmin: user?.role === "admin",
  };
}
