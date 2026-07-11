"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true only after hydration on the client. Uses `useSyncExternalStore`
 * so there is no setState-in-effect and the server snapshot is always `false`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
