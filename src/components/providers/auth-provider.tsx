"use client";

import { Loader2 } from "lucide-react";
import { useGetMeQuery } from "@/features/auth";

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
