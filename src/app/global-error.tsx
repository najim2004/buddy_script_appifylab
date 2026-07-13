"use client";

import { useEffect } from "react";
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="text-2xl font-semibold">Application error</h2>
        <p className="text-muted-foreground">
          A critical error occurred. Please reload the application.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Reload
        </button>
      </body>
    </html>
  );
}
