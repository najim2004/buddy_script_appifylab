"use client";

import { Loader2 } from "lucide-react";
import { useGetMeQuery } from "@/features/auth";

/**
 * Bootstraps the auth session on app load.
 *
 * On mount it calls `/auth/me`. If the in-memory access token is missing or
 * expired the request returns 401, which the base query intercepts to perform
 * a silent refresh using the httpOnly refresh-token cookie. This restores the
 * session after a page reload WITHOUT storing tokens in localStorage (XSS-safe).
 *
 * A full-screen loader is shown only during the very first check to avoid an
 * authenticated/unauthenticated UI flicker.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
