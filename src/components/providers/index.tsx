"use client";

import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "./redux-provider";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import { SocketProvider } from "./socket-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <SocketProvider>{children}</SocketProvider>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
